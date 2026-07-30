import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import {
  AccountBalanceWalletOutlined,
  Close,
  DashboardOutlined,
  DonutLargeOutlined,
  Logout,
  ReceiptLongOutlined,
  Search,
  ShowChartOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";

// register the extra chart types we're now using
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

const API = process.env.REACT_APP_API_URL || "http://localhost:3002";
const watchlist = [
  { name: "RELIANCE", price: 2946.4, change: 1.12 },
  { name: "TCS", price: 4130.15, change: -0.38 },
  { name: "INFY", price: 1823.7, change: 0.92 },
  { name: "HDFCBANK", price: 1682.8, change: 0.44 },
  { name: "ICICIBANK", price: 1285.65, change: -0.61 },
  { name: "SBIN", price: 816.4, change: 1.84 },
];
const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
const signed = (value) =>
  `${value >= 0 ? "+" : ""}${Number(value || 0).toFixed(2)}%`;

// palette for the doughnut segments
const PALETTE = [
  "#7757f4",
  "#13a875",
  "#f6b54f",
  "#df5969",
  "#2f6fed",
  "#a9812e",
  "#0e9f6e",
  "#6b7280",
  "#d64545",
  "#101c33",
];

function api(path, options = {}) {
  const token = localStorage.getItem("kite_token");
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
    .catch(() => {
      throw new Error(
        `Cannot reach the API at ${API}. Start the Backend service and check REACT_APP_API_URL.`,
      );
    })
    .then(async (res) => {
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || "Something went wrong");
      return body.data;
    });
}

const Auth = ({ onSuccess }) => {
  const [register, setRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api(`/api/auth/${register ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem("kite_token", data.token);
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand">
          <span>k</span>Kite<span className="brand-dot">.</span>
        </div>
        <p className="eyebrow">INVEST WITH CLARITY</p>
        <h1>{register ? "Build your investing habit." : "Welcome back."}</h1>
        <p className="muted">
          A clean, secure home for your long-term portfolio.
        </p>
        <form onSubmit={submit}>
          {register && (
            <label>
              Full name
              <input
                required
                minLength="2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
            </label>
          )}
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              required
              minLength="8"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
            />
          </label>
          {error && <p className="notice error">{error}</p>}
          <button className="primary full" disabled={loading}>
            {loading ? "Please wait…" : register ? "Create account" : "Sign in"}
          </button>
        </form>
        <button
          className="text-button"
          onClick={() => {
            setRegister(!register);
            setError("");
          }}
        >
          {register
            ? "Already have an account? Sign in"
            : "New to Kite? Create an account"}
        </button>
      </section>
      <aside className="auth-aside">
        <p>PORTFOLIO, SIMPLIFIED</p>
        <h2>Decisions are easier when the whole picture is in one place.</h2>
        <div className="auth-stat">
          <TrendingUpOutlined />{" "}
          <span>
            <b>₹0 brokerage</b>
            <br />
            on equity delivery
          </span>
        </div>
      </aside>
    </main>
  );
};

const Stat = ({ title, value, sub, positive, icon }) => (
  <article className="stat-card">
    <div className="stat-icon">{icon}</div>
    <p>{title}</p>
    <h2>{value}</h2>
    <small
      className={
        positive === undefined ? "" : positive ? "positive" : "negative"
      }
    >
      {sub}
    </small>
  </article>
);
const Table = ({ title, columns, rows, empty }) => (
  <section className="panel table-panel">
    <div className="panel-heading">
      <h2>{title}</h2>
      <span>{rows.length} items</span>
    </div>
    {rows.length ? (
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.label}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row._id || i}>
                {columns.map((col) => (
                  <td className={col.className?.(row)} key={col.label}>
                    {col.value(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="empty">
        <DonutLargeOutlined />
        <p>{empty}</p>
      </div>
    )}
  </section>
);

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState({
    holdings: [],
    positions: [],
    orders: [],
    stats: {},
  });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState(null);
  const [orderForm, setOrderForm] = useState({ qty: 1, price: "" });
  const active = location.pathname.split("/")[1] || "overview";
  const load = async () => {
    setStatus("loading");
    try {
      setPortfolio(await api("/api/portfolio"));
      setStatus("ready");
    } catch (err) {
      setError(err.message);
      setStatus("error");
      if (/session|authentication|expired/i.test(err.message))
        localStorage.removeItem("kite_token");
    }
  };
  useEffect(() => {
    const sharedToken = new URLSearchParams(location.search).get("token");
    if (sharedToken) {
      localStorage.setItem("kite_token", sharedToken);
      window.history.replaceState({}, "", location.pathname);
    }
    if (!localStorage.getItem("kite_token")) {
      setStatus("guest");
      return;
    }
    api("/api/auth/me")
      .then((d) => {
        setUser(d.user);
        load();
      })
      .catch(() => {
        localStorage.removeItem("kite_token");
        setStatus("guest");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredWatchlist = useMemo(
    () =>
      watchlist.filter((stock) =>
        stock.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  // ---------- NEW: live-ticking series for the performance chart ----------
  // Seeds a rolling window of points from the real current value, then
  // nudges the last point every 2s with a small random walk so the chart
  // visibly updates on its own, without needing a real tick feed.
  const [series, setSeries] = useState([]);
  const seededRef = useRef(false);

  useEffect(() => {
    const base = portfolio.stats.currentValue || 0;
    if (base && !seededRef.current) {
      seededRef.current = true;
      const seed = Array.from(
        { length: 20 },
        (_, i) => base * (0.97 + Math.sin(i / 3) * 0.01 + i * 0.0015),
      );
      setSeries(seed);
    }
  }, [portfolio.stats.currentValue]);

  useEffect(() => {
    if (!series.length) return;
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(0, last * (1 + (Math.random() - 0.5) * 0.006));
        return [...prev.slice(1), next];
      });
    }, 2000);
    return () => clearInterval(id);
  }, [series.length]);

  const chart = useMemo(
    () => ({
      labels: series.map((_, i) => (i === series.length - 1 ? "now" : "")),
      datasets: [
        {
          data: series,
          borderColor: "#7757f4",
          backgroundColor: "rgba(119,87,244,.14)",
          fill: true,
          tension: 0.42,
          pointRadius: 0,
          borderWidth: 2.5,
        },
      ],
    }),
    [series],
  );

  // ---------- NEW: portfolio allocation doughnut ----------
  const allocation = useMemo(() => {
    const rows = portfolio.holdings
      .map((h) => ({ name: h.name, value: (h.price || 0) * (h.qty || 0) }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value);
    const top = rows.slice(0, 8);
    const rest = rows.slice(8).reduce((sum, r) => sum + r.value, 0);
    if (rest > 0) top.push({ name: "Others", value: rest });
    return {
      labels: top.map((r) => r.name),
      datasets: [
        {
          data: top.map((r) => r.value),
          backgroundColor: top.map((_, i) => PALETTE[i % PALETTE.length]),
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    };
  }, [portfolio.holdings]);

  // ---------- NEW: P&L per holding bar chart ----------
  const pnlByHolding = useMemo(() => {
    const rows = portfolio.holdings.map((h) => ({
      name: h.name,
      pnl: (h.qty || 0) * ((h.price || 0) - (h.avg || 0)),
    }));
    return {
      labels: rows.map((r) => r.name),
      datasets: [
        {
          data: rows.map((r) => r.pnl),
          backgroundColor: rows.map((r) =>
            r.pnl >= 0 ? "#13a875" : "#df5969",
          ),
          borderRadius: 4,
          maxBarThickness: 28,
        },
      ],
    };
  }, [portfolio.holdings]);

  const placeOrder = async (event) => {
    event.preventDefault();
    try {
      await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          name: order.name,
          mode: order.mode,
          qty: Number(orderForm.qty),
          price: Number(orderForm.price || order.price),
          product: "CNC",
        }),
      });
      setOrder(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };
  if (status === "guest")
    return (
      <Auth
        onSuccess={(profile) => {
          setUser(profile);
          load();
        }}
      />
    );
  if (status === "loading" && !user)
    return (
      <div className="loading-screen">
        <div className="spinner" /> Loading your workspace…
      </div>
    );
  const stats = portfolio.stats || {};
  const pnlPositive = Number(stats.pnl || 0) >= 0;
  const nav = [
    { id: "overview", icon: <DashboardOutlined />, label: "Overview" },
    { id: "holdings", icon: <DonutLargeOutlined />, label: "Holdings" },
    { id: "positions", icon: <ShowChartOutlined />, label: "Positions" },
    { id: "orders", icon: <ReceiptLongOutlined />, label: "Orders" },
    { id: "funds", icon: <AccountBalanceWalletOutlined />, label: "Funds" },
  ];
  const holdingsColumns = [
    { label: "Instrument", value: (r) => <b>{r.name}</b> },
    { label: "Qty", value: (r) => r.qty },
    { label: "Avg. cost", value: (r) => currency(r.avg) },
    { label: "LTP", value: (r) => currency(r.price) },
    { label: "Current value", value: (r) => currency(r.qty * r.price) },
    {
      label: "P&L",
      value: (r) => {
        const v = r.qty * (r.price - r.avg);
        return `${v >= 0 ? "+" : ""}${currency(v)}`;
      },
      className: (r) => (r.price >= r.avg ? "positive" : "negative"),
    },
  ];
  const orderColumns = [
    {
      label: "Time",
      value: (r) =>
        new Date(r.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
    { label: "Instrument", value: (r) => <b>{r.name}</b> },
    {
      label: "Type",
      value: (r) => (
        <span className={`tag ${r.mode === "BUY" ? "buy" : "sell"}`}>
          {r.mode}
        </span>
      ),
    },
    { label: "Qty", value: (r) => r.qty },
    { label: "Price", value: (r) => currency(r.price) },
    {
      label: "Status",
      value: (r) => <span className="tag complete">{r.status}</span>,
    },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/">
          Kite<span>.</span>
        </Link>
        <nav>
          {nav.map((item) => (
            <Link
              key={item.id}
              to={item.id === "overview" ? "/" : `/${item.id}`}
              className={active === item.id ? "nav-item active" : "nav-item"}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="avatar">{user?.name?.slice(0, 1).toUpperCase()}</div>
          <div>
            <b>{user?.name}</b>
            <small>{user?.email}</small>
          </div>
          <button
            aria-label="Sign out"
            onClick={() => {
              localStorage.removeItem("kite_token");
              setUser(null);
              setStatus("guest");
            }}
          >
            <Logout />
          </button>
        </div>
      </aside>
      <main className="workspace">
        <header>
          <div>
            <p className="eyebrow">SATURDAY, 26 JULY</p>
            <h1>
              {active === "overview" ? "Good morning, " : ""}
              {active === "overview"
                ? user?.name?.split(" ")[0]
                : active[0].toUpperCase() + active.slice(1)}
              .
            </h1>
          </div>
          <div className="market">
            <span className="pulse" /> Markets closed{" "}
            <small>Opens Monday, 09:15</small>
          </div>
        </header>
        {error && (
          <div className="notice error">
            {error}
            <button onClick={() => setError("")}>
              <Close />
            </button>
          </div>
        )}
        {status === "loading" && (
          <div className="inline-loading">Refreshing portfolio…</div>
        )}

        {active === "overview" && (
          <>
            <section className="stats-grid">
              <Stat
                title="Portfolio value"
                value={currency(stats.currentValue)}
                sub={`${signed(stats.pnlPercent)} all time`}
                positive={pnlPositive}
                icon={<AccountBalanceWalletOutlined />}
              />
              <Stat
                title="Total P&L"
                value={currency(stats.pnl)}
                sub={`${pnlPositive ? "Profit" : "Loss"} on investments`}
                positive={pnlPositive}
                icon={<TrendingUpOutlined />}
              />
              <Stat
                title="Available margin"
                value={currency(stats.availableMargin)}
                sub="Ready to invest"
                icon={<ShowChartOutlined />}
              />
              <Stat
                title="Invested"
                value={currency(stats.investment)}
                sub={`${portfolio.holdings.length} active holdings`}
                icon={<DonutLargeOutlined />}
              />
            </section>

            <section className="content-grid">
              <article className="panel performance">
                <div className="panel-heading">
                  <div>
                    <p>PORTFOLIO PERFORMANCE</p>
                    <h2>{currency(stats.currentValue)}</h2>
                  </div>
                  <span
                    className={pnlPositive ? "positive pill" : "negative pill"}
                  >
                    {signed(stats.pnlPercent)}
                  </span>
                </div>
                <Line
                  data={chart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 400 },
                    plugins: { tooltip: { displayColors: false } },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: "#9ba1b6" },
                      },
                      y: { display: false },
                    },
                  }}
                />
              </article>

              <article className="panel allocation">
                <div className="panel-heading">
                  <h2>Portfolio snapshot</h2>
                </div>
                <div className="snapshot">
                  <span>Holdings</span>
                  <b>{portfolio.holdings.length}</b>
                  <span>Orders placed</span>
                  <b>{portfolio.orders.length}</b>
                  <span>Realised value</span>
                  <b>{currency(stats.realised)}</b>
                </div>
                <button
                  className="primary"
                  onClick={() => navigate("/holdings")}
                >
                  View holdings
                </button>
              </article>
            </section>

            {/* NEW: allocation + P&L charts row */}
            <section className="content-grid">
              <article className="panel" style={{ minHeight: 320 }}>
                <div className="panel-heading">
                  <h2>Allocation by holding</h2>
                </div>
                {allocation.labels.length ? (
                  <Doughnut
                    data={allocation}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "62%",
                      plugins: {
                        legend: {
                          position: "right",
                          labels: { boxWidth: 10, font: { size: 11 } },
                        },
                        tooltip: {
                          callbacks: {
                            label: (ctx) =>
                              ` ${ctx.label}: ${currency(ctx.parsed)}`,
                          },
                        },
                      },
                    }}
                    style={{ maxHeight: 260 }}
                  />
                ) : (
                  <div className="empty">
                    <DonutLargeOutlined />
                    <p>Allocation appears once you hold something.</p>
                  </div>
                )}
              </article>

              <article className="panel" style={{ minHeight: 320 }}>
                <div className="panel-heading">
                  <h2>P&amp;L by holding</h2>
                </div>
                {pnlByHolding.labels.length ? (
                  <Bar
                    data={pnlByHolding}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: "y",
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (ctx) => ` ${currency(ctx.parsed.x)}`,
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: {
                            color: "#9ba1b6",
                            callback: (v) => currency(v),
                          },
                        },
                        y: { grid: { display: false } },
                      },
                    }}
                    style={{ maxHeight: 260 }}
                  />
                ) : (
                  <div className="empty">
                    <DonutLargeOutlined />
                    <p>P&amp;L breakdown appears once you hold something.</p>
                  </div>
                )}
              </article>
            </section>

            <Table
              title="Top holdings"
              columns={holdingsColumns}
              rows={portfolio.holdings.slice(0, 5)}
              empty="Your investments will appear here after your first order."
            />
          </>
        )}

        {active === "holdings" && (
          <Table
            title="Your holdings"
            columns={holdingsColumns}
            rows={portfolio.holdings}
            empty="No holdings yet. Use the watchlist to make your first investment."
          />
        )}
        {active === "positions" && (
          <Table
            title="Day positions"
            columns={holdingsColumns}
            rows={portfolio.positions}
            empty="You have no open intraday positions."
          />
        )}
        {active === "orders" && (
          <Table
            title="Order history"
            columns={orderColumns}
            rows={portfolio.orders}
            empty="Your completed orders will be listed here."
          />
        )}
        {active === "funds" && (
          <section className="fund-card panel">
            <p className="eyebrow">EQUITY</p>
            <h2>{currency(stats.availableMargin)}</h2>
            <p className="muted">Available margin</p>
            <div className="fund-breakdown">
              <span>
                Opening balance <b>{currency(user?.availableMargin)}</b>
              </span>
              <span>
                Funds used{" "}
                <b>
                  {currency(
                    (user?.availableMargin || 0) - (stats.availableMargin || 0),
                  )}
                </b>
              </span>
              <span>
                Available cash <b>{currency(stats.availableMargin)}</b>
              </span>
            </div>
          </section>
        )}
      </main>
      <aside className="watch-panel">
        <div className="watch-header">
          <h2>Watchlist</h2>
          <button onClick={() => setQuery("")} aria-label="Clear search">
            <Search />
          </button>
        </div>
        <label className="watch-search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search instruments"
          />
        </label>
        <div className="watch-items">
          {filteredWatchlist.map((stock) => (
            <article key={stock.name}>
              <div>
                <b>{stock.name}</b>
                <small className={stock.change >= 0 ? "positive" : "negative"}>
                  {signed(stock.change)}
                </small>
              </div>
              <div className="quote">
                <b>{currency(stock.price)}</b>
                <button
                  className="quick-buy"
                  onClick={() => {
                    setOrder({ ...stock, mode: "BUY" });
                    setOrderForm({ qty: 1, price: stock.price });
                  }}
                >
                  Buy
                </button>
                <button
                  className="quick-sell"
                  onClick={() => {
                    setOrder({ ...stock, mode: "SELL" });
                    setOrderForm({ qty: 1, price: stock.price });
                  }}
                >
                  Sell
                </button>
              </div>
            </article>
          ))}
        </div>
      </aside>
      {order && (
        <div className="modal-backdrop">
          <form className="order-modal" onSubmit={placeOrder}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setOrder(null)}
            >
              <Close />
            </button>
            <p className="eyebrow">NSE · CNC</p>
            <h2>
              {order.mode} {order.name}
            </h2>
            <label>
              Quantity
              <input
                type="number"
                min="1"
                required
                value={orderForm.qty}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, qty: e.target.value })
                }
              />
            </label>
            <label>
              Price
              <input
                type="number"
                min=".01"
                step=".01"
                required
                value={orderForm.price}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, price: e.target.value })
                }
              />
            </label>
            <p className="muted">
              Estimated value{" "}
              <b>
                {currency(
                  Number(orderForm.qty || 0) * Number(orderForm.price || 0),
                )}
              </b>
            </p>
            <button
              className={`primary full ${order.mode === "SELL" ? "sell-button" : ""}`}
            >
              {order.mode} {order.name}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
