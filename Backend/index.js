require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HoldingsModel = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const User = require("./model/UserModel");

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const JWT_SECRET = process.env.JWT_SECRET || "change-this-development-secret";

const allowedOrigins = (process.env.CLIENT_ORIGINS || "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    // Tools such as curl have no Origin header; allow them while keeping browser origins explicit.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "100kb" }));

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const send = (res, status, data, message) => res.status(status).json({ success: status < 400, ...(message && { message }), data });
const money = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const tokenFor = (user) => jwt.sign({ sub: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: "7d" });
const demoHoldings = [
  ["RELIANCE", 18, 2720, 2946.4], ["TCS", 12, 3925, 4130.15], ["INFY", 28, 1680, 1823.7], ["HDFCBANK", 35, 1568, 1682.8], ["ICICIBANK", 30, 1190, 1285.65],
  ["SBIN", 50, 740, 816.4], ["ITC", 65, 412, 438.5], ["WIPRO", 45, 498, 531.2], ["TATAMOTORS", 32, 905, 978.6], ["ASIANPAINT", 10, 2840, 3015.4],
];
const seedDemoAccount = async () => {
  let demo = await User.findOne({ email: "demo@gmail.com" }).select("+passwordHash");
  if (!demo) demo = await User.create({ name: "Demo Investor", email: "demo@gmail.com", passwordHash: await bcrypt.hash("QAZplm123", 12), availableMargin: 100000 });
  if (demo.demoSeedVersion === 1) return;
  demo.name = "Demo Investor";
  demo.availableMargin = 100000;
  demo.passwordHash = await bcrypt.hash("QAZplm123", 12);
  demo.demoSeedVersion = 1;
  await Promise.all([HoldingsModel.deleteMany({ user: demo._id }), PositionsModel.deleteMany({ user: demo._id }), OrdersModel.deleteMany({ user: demo._id })]);
  await Promise.all(demoHoldings.map(([name, qty, avg, price]) => HoldingsModel.create({ user: demo._id, name, qty, avg, price, net: `${(((price - avg) / avg) * 100).toFixed(2)}%`, day: "0.00%" })));
  await PositionsModel.insertMany(demoHoldings.slice(0, 6).map(([name, qty, avg, price], index) => ({ user: demo._id, name, product: index % 2 ? "MIS" : "CNC", qty: index % 2 ? -Math.ceil(qty / 4) : Math.ceil(qty / 3), avg, price, net: "0.00%", day: index % 2 ? "-0.32%" : "+0.48%", isLoss: Boolean(index % 2) })));
  const orders = Array.from({ length: 15 }, (_, index) => { const [name, qty, avg, price] = demoHoldings[index % demoHoldings.length]; return { user: demo._id, name, qty: Math.max(1, Math.floor(qty / 3)), price: index % 3 ? price : avg, mode: index % 4 === 0 ? "SELL" : "BUY", product: index % 2 ? "MIS" : "CNC", status: "COMPLETE", createdAt: new Date(Date.now() - index * 86400000) }; });
  await OrdersModel.insertMany(orders);
  await demo.save();
  console.log("Demo account seeded");
};

const authenticate = asyncRoute(async (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return send(res, 401, null, "Authentication is required");
  const payload = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(payload.sub).select("-passwordHash");
  if (!user) return send(res, 401, null, "Session is no longer valid");
  req.user = user;
  next();
});

const authorize = (...roles) => (req, res, next) => roles.includes(req.user.role)
  ? next()
  : send(res, 403, null, "You do not have permission for this action");

app.get("/health", (req, res) => send(res, 200, { status: "ok" }));
app.get("/", (req, res) => send(res, 200, { service: "Kite portfolio API", status: "ok", health: "/health" }));

app.post("/api/auth/register", asyncRoute(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || "") || typeof password !== "string" || password.length < 8) {
    return send(res, 400, null, "Provide a name, valid email, and a password of at least 8 characters");
  }
  if (await User.exists({ email: email.toLowerCase() })) return send(res, 409, null, "An account already exists for this email");
  const user = await User.create({ name: name.trim(), email: email.toLowerCase(), passwordHash: await bcrypt.hash(password, 12) });
  return send(res, 201, { token: tokenFor(user), user: user.publicProfile() }, "Account created");
}));

app.post("/api/auth/login", asyncRoute(async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email: String(email || "").toLowerCase() }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(String(password || ""), user.passwordHash))) return send(res, 401, null, "Email or password is incorrect");
  return send(res, 200, { token: tokenFor(user), user: user.publicProfile() }, "Welcome back");
}));

app.get("/api/auth/me", authenticate, (req, res) => send(res, 200, { user: req.user.publicProfile() }));

app.get("/api/portfolio", authenticate, asyncRoute(async (req, res) => {
  const [holdings, positions, orders] = await Promise.all([
    HoldingsModel.find({ user: req.user._id }).sort({ name: 1 }).lean(),
    PositionsModel.find({ user: req.user._id }).sort({ updatedAt: -1 }).lean(),
    OrdersModel.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100).lean(),
  ]);
  const investment = holdings.reduce((total, item) => total + item.avg * item.qty, 0);
  const currentValue = holdings.reduce((total, item) => total + item.price * item.qty, 0);
  const realised = orders.filter((o) => o.mode === "SELL" && o.status === "COMPLETE").reduce((total, o) => total + o.qty * o.price, 0);
  send(res, 200, { holdings, positions, orders, stats: { investment: money(investment), currentValue: money(currentValue), pnl: money(currentValue - investment), pnlPercent: investment ? money(((currentValue - investment) / investment) * 100) : 0, realised: money(realised), availableMargin: req.user.availableMargin } });
}));

app.post("/api/orders", authenticate, asyncRoute(async (req, res) => {
  const { name, qty, price, mode, product = "CNC" } = req.body || {};
  const quantity = Number(qty); const orderPrice = Number(price);
  if (!name?.trim() || !["BUY", "SELL"].includes(mode) || !Number.isInteger(quantity) || quantity <= 0 || !Number.isFinite(orderPrice) || orderPrice <= 0 || !["CNC", "MIS"].includes(product)) return send(res, 400, null, "Provide a valid instrument, integer quantity, price, mode, and product");
  const value = money(quantity * orderPrice);
  if (mode === "BUY" && req.user.availableMargin < value) return send(res, 422, null, "Insufficient available margin");
  const holding = await HoldingsModel.findOne({ user: req.user._id, name: name.trim().toUpperCase() });
  if (mode === "SELL" && (!holding || holding.qty < quantity)) return send(res, 422, null, "Insufficient quantity available to sell");
  const order = await OrdersModel.create({ user: req.user._id, name: name.trim().toUpperCase(), qty: quantity, price: orderPrice, mode, product, status: "COMPLETE" });
  if (mode === "BUY") {
    if (holding) { holding.avg = money(((holding.avg * holding.qty) + value) / (holding.qty + quantity)); holding.qty += quantity; holding.price = orderPrice; await holding.save(); }
    else await HoldingsModel.create({ user: req.user._id, name: order.name, qty: quantity, avg: orderPrice, price: orderPrice, net: "0.00%", day: "0.00%" });
    req.user.availableMargin = money(req.user.availableMargin - value);
  } else {
    holding.qty -= quantity;
    if (holding.qty === 0) await holding.deleteOne(); else { holding.price = orderPrice; await holding.save(); }
    req.user.availableMargin = money(req.user.availableMargin + value);
  }
  await req.user.save();
  send(res, 201, { order }, "Order placed successfully");
}));

app.get("/api/users", authenticate, authorize("admin"), asyncRoute(async (req, res) => send(res, 200, { users: await User.find().select("-passwordHash").lean() })));

// Legacy tutorial endpoints are retained for a smooth upgrade, but now require a session.
app.get("/allHoldings", authenticate, asyncRoute(async (req, res) => res.json(await HoldingsModel.find({ user: req.user._id }).lean())));
app.get("/allPositions", authenticate, asyncRoute(async (req, res) => res.json(await PositionsModel.find({ user: req.user._id }).lean())));
app.post("/newOrder", authenticate, (req, res, next) => { req.url = "/api/orders"; app.handle(req, res, next); });

app.use((req, res) => send(res, 404, null, "Route not found"));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") return send(res, 401, null, "Invalid or expired session");
  if (err.name === "ValidationError") return send(res, 400, null, Object.values(err.errors).map((e) => e.message).join(", "));
  if (err.code === 11000) return send(res, 409, null, "A record with that value already exists");
  return send(res, 500, null, "An unexpected server error occurred");
});

mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 8000 })
  .then(async () => { await seedDemoAccount(); app.listen(PORT, () => console.log(`API listening on ${PORT}`)); })
  .catch((error) => { console.error("Database connection failed:", error.message); process.exit(1); });

module.exports = app;
