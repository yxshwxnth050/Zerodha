import { useEffect, useMemo, useState } from "react";
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
  TrendingDownOutlined,
  PushPinOutlined,
  PushPin,
  ListAltOutlined,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

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

// ---------------------------------------------------------------------------
// DUMMY DATA — bigger, more realistic universe of stocks so visualizations
// have real winners/losers to show. `change` = today's %, `avg` is a sample
// buy price used to synthesize demo holdings when the backend has none yet.
// ---------------------------------------------------------------------------
const ALL_STOCKS = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: 2946.4,
    change: 1.12,
    avg: 2510.0,
    sector: "Energy",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Svcs",
    price: 4130.15,
    change: -0.38,
    avg: 4460.0,
    sector: "IT",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    price: 1823.7,
    change: 0.92,
    avg: 1390.0,
    sector: "IT",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    price: 1682.8,
    change: 0.44,
    avg: 1520.0,
    sector: "Banking",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank",
    price: 1285.65,
    change: -0.61,
    avg: 1340.0,
    sector: "Banking",
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    price: 816.4,
    change: 1.84,
    avg: 620.0,
    sector: "Banking",
  },
  {
    symbol: "WIPRO",
    name: "Wipro",
    price: 577.75,
    change: 0.32,
    avg: 489.3,
    sector: "IT",
  },
  {
    symbol: "ITC",
    name: "ITC Ltd",
    price: 207.9,
    change: 0.8,
    avg: 202.0,
    sector: "FMCG",
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever",
    price: 2417.4,
    change: 0.21,
    avg: 2680.0,
    sector: "FMCG",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    price: 1521.15,
    change: 2.99,
    avg: 890.0,
    sector: "Telecom",
  },
  {
    symbol: "M&M",
    name: "Mahindra & Mahindra",
    price: 779.8,
    change: -0.01,
    avg: 1080.0,
    sector: "Auto",
  },
  {
    symbol: "TATAPOWER",
    name: "Tata Power",
    price: 124.15,
    change: -0.24,
    avg: 210.0,
    sector: "Energy",
  },
  {
    symbol: "ADANIENT",
    name: "Adani Enterprises",
    price: 2830.0,
    change: -3.42,
    avg: 3450.0,
    sector: "Diversified",
  },
  {
    symbol: "ZOMATO",
    name: "Zomato",
    price: 178.2,
    change: 4.55,
    avg: 62.0,
    sector: "Consumer Svcs",
  },
  {
    symbol: "PAYTM",
    name: "One97 (Paytm)",
    price: 412.3,
    change: -5.18,
    avg: 810.0,
    sector: "Fintech",
  },
  {
    symbol: "YESBANK",
    name: "Yes Bank",
    price: 21.85,
    change: -2.1,
    avg: 34.0,
    sector: "Banking",
  },
  {
    symbol: "TATASTEEL",
    name: "Tata Steel",
    price: 148.6,
    change: 1.05,
    avg: 122.0,
    sector: "Metals",
  },
  {
    symbol: "ONGC",
    name: "ONGC",
    price: 246.8,
    change: -0.09,
    avg: 168.0,
    sector: "Energy",
  },
  {
    symbol: "TITAN",
    name: "Titan Company",
    price: 3402.1,
    change: 0.68,
    avg: 2760.0,
    sector: "Consumer",
  },
  {
    symbol: "ASIANPAINT",
    name: "Asian Paints",
    price: 2321.5,
    change: -1.35,
    avg: 3010.0,
    sector: "Consumer",
  },
];

const DEFAULT_WATCHLIST_SYMBOLS = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "SBIN",
];
const WATCHLIST_STORAGE_KEY = "kite_watchlist_symbols";

// Fallback holdings used ONLY when the backend hasn't returned any real
// holdings yet, so charts/visualizations have realistic winners+losers to
// demo with. Built from ALL_STOCKS avg/price so P&L varies meaningfully.
const DUMMY_HOLDINGS_SYMBOLS = [
  "BHARTIARTL",
  "ZOMATO",
  "SBIN",
  "TATASTEEL",
  "INFY",
  "ADANIENT",
  "PAYTM",
  "M&M",
  "HINDUNILVR",
  "ASIANPAINT",
];
const buildDummyHoldings = () =>
  DUMMY_HOLDINGS_SYMBOLS.map((sym) => {
    const s = ALL_STOCKS.find((x) => x.symbol === sym);
    const qty = 1 + Math.floor(Math.random() * 8);
    return {
      name: s.symbol,
      qty,
      avg: s.avg,
      price: s.price,
      day: `${s.change >= 0 ? "+" : ""}${s.change}%`,
      isLoss: s.change < 0,
    };
  });

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
const signed = (value) =>
  `${value >= 0 ? "+" : ""}${Number(value || 0).toFixed(2)}%`;

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

  // ---------------------------------------------------------------------
  // WATCHLIST — persistent, searchable, pin/unpin. Backed by localStorage
  // so it survives refreshes, seeded with a sane default set of symbols.
  // ---------------------------------------------------------------------
  const [watchSymbols, setWatchSymbols] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(WATCHLIST_STORAGE_KEY));
      return Array.isArray(saved) && saved.length
        ? saved
        : DEFAULT_WATCHLIST_SYMBOLS;
    } catch {
      return DEFAULT_WATCHLIST_SYMBOLS;
    }
  });
  useEffect(() => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchSymbols));
  }, [watchSymbols]);

  const [watchQuery, setWatchQuery] = useState("");
  const watchStocks = useMemo(
    () =>
      watchSymbols
        .map((sym) => ALL_STOCKS.find((s) => s.symbol === sym))
        .filter(Boolean),
    [watchSymbols],
  );
  const filteredWatchlist = useMemo(
    () =>
      watchStocks.filter(
        (s) =>
          s.name.toLowerCase().includes(watchQuery.toLowerCase()) ||
          s.symbol.toLowerCase().includes(watchQuery.toLowerCase()),
      ),
    [watchStocks, watchQuery],
  );
  // search-to-add: only shows results NOT already pinned, when there's a query
  const searchResults = useMemo(() => {
    if (!watchQuery.trim()) return [];
    const q = watchQuery.toLowerCase();
    return ALL_STOCKS.filter(
      (s) =>
        !watchSymbols.includes(s.symbol) &&
        (s.name.toLowerCase().includes(q) ||
          s.symbol.toLowerCase().includes(q)),
    ).slice(0, 6);
  }, [watchQuery, watchSymbols]);

  const pinStock = (symbol) =>
    setWatchSymbols((prev) =>
      prev.includes(symbol) ? prev : [...prev, symbol],
    );
  const unpinStock = (symbol) =>
    setWatchSymbols((prev) => prev.filter((s) => s !== symbol));

  // ---------------------------------------------------------------------
  // Holdings used for visualization: real backend holdings if present,
  // otherwise a realistic dummy set with winners+losers for demo purposes.
  // ---------------------------------------------------------------------
  const [dummyHoldings] = useState(buildDummyHoldings);
  const effectiveHoldings = portfolio.holdings.length
    ? portfolio.holdings
    : dummyHoldings;
  const usingDummyHoldings = portfolio.holdings.length === 0;

  const chart = useMemo(() => {
    const base =
      portfolio.stats.currentValue ||
      effectiveHoldings.reduce(
        (sum, h) => sum + (h.price || 0) * (h.qty || 0),
        0,
      );
    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Today"],
      datasets: [
        {
          data: [94, 97, 96, 101, 99, 104].map((n) => (base * n) / 100),
          borderColor: "#7757f4",
          backgroundColor: "rgba(119,87,244,.14)",
          fill: true,
          tension: 0.42,
          pointRadius: 0,
          borderWidth: 2.5,
        },
      ],
    };
  }, [portfolio.stats.currentValue, effectiveHoldings]);

  // allocation doughnut
  const allocation = useMemo(() => {
    const rows = effectiveHoldings
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
  }, [effectiveHoldings]);

  // per-holding P&L, sorted best -> worst, for the Holdings-page bar chart
  const pnlRows = useMemo(() => {
    return effectiveHoldings
      .map((h) => ({
        name: h.name,
        pnl: (h.qty || 0) * ((h.price || 0) - (h.avg || 0)),
        pnlPct: h.avg ? (((h.price || 0) - h.avg) / h.avg) * 100 : 0,
      }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [effectiveHoldings]);
  const pnlByHolding = useMemo(
    () => ({
      labels: pnlRows.map((r) => r.name),
      datasets: [
        {
          data: pnlRows.map((r) => r.pnl),
          backgroundColor: pnlRows.map((r) =>
            r.pnl >= 0 ? "#13a875" : "#df5969",
          ),
          borderRadius: 4,
          maxBarThickness: 28,
        },
      ],
    }),
    [pnlRows],
  );
  const topGainer = pnlRows[0];
  const topLoser = pnlRows[pnlRows.length - 1];

  // ---------------------------------------------------------------------
  // TRADE PULSE — a visualization that reacts the moment a buy/sell fires.
  // Stores the last N trades and renders a bold, animating gauge/callout
  // that pulses whenever `lastTrade` changes.
  // ---------------------------------------------------------------------
  const [tradeLog, setTradeLog] = useState([]); // {mode, name, qty, price, value, ts}
  const lastTrade = tradeLog[0];

  const placeOrder = async (event) => {
    event.preventDefault();
    try {
      const qty = Number(orderForm.qty);
      const price = Number(orderForm.price || order.price);
      await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          name: order.name,
          mode: order.mode,
          qty,
          price,
          product: "CNC",
        }),
      });
      setTradeLog((prev) =>
        [
          {
            mode: order.mode,
            name: order.name,
            qty,
            price,
            value: qty * price,
            ts: Date.now(),
          },
          ...prev,
        ].slice(0, 5),
      );
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
    { id: "stocks", icon: <ListAltOutlined />, label: "All Stocks" },
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
                : active === "stocks"
                  ? "All Stocks"
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

              {/* TRADE PULSE — reacts visibly the instant a buy/sell happens */}
              <article
                className={`panel trade-pulse ${lastTrade ? (lastTrade.mode === "BUY" ? "pulse-buy" : "pulse-sell") : ""}`}
                key={lastTrade?.ts || "none"}
              >
                <div className="panel-heading">
                  <h2>Trade pulse</h2>
                </div>
                {lastTrade ? (
                  <div className="trade-pulse-body">
                    <div
                      className={`trade-pulse-ring ${lastTrade.mode === "BUY" ? "ring-buy" : "ring-sell"}`}
                    >
                      {lastTrade.mode === "BUY" ? (
                        <ArrowUpward />
                      ) : (
                        <ArrowDownward />
                      )}
                    </div>
                    <div>
                      <p className="muted" style={{ margin: 0 }}>
                        {lastTrade.mode === "BUY" ? "Bought" : "Sold"}
                      </p>
                      <h2 style={{ margin: "2px 0" }}>
                        {lastTrade.qty} × {lastTrade.name}
                      </h2>
                      <p className="muted" style={{ margin: 0 }}>
                        at {currency(lastTrade.price)} · value{" "}
                        {currency(lastTrade.value)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="empty">
                    <ShowChartOutlined />
                    <p>Place a buy or sell order to see it light up here.</p>
                  </div>
                )}
                {tradeLog.length > 1 && (
                  <ul className="trade-pulse-history">
                    {tradeLog.slice(1).map((t) => (
                      <li key={t.ts}>
                        <span
                          className={t.mode === "BUY" ? "positive" : "negative"}
                        >
                          {t.mode}
                        </span>{" "}
                        {t.qty} {t.name} @ {currency(t.price)}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </section>

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

            <Table
              title="Top holdings"
              columns={holdingsColumns}
              rows={portfolio.holdings.slice(0, 5)}
              empty="Your investments will appear here after your first order."
            />
          </>
        )}

        {active === "holdings" && (
          <>
            {usingDummyHoldings && (
              <div
                className="notice"
                style={{ background: "#f1eeff", color: "#5b3fd1" }}
              >
                Showing sample holdings so the charts below have something to
                visualize — place a real order to replace this with your own
                data.
              </div>
            )}

            <section className="stats-grid">
              <Stat
                title="Best performer"
                value={topGainer?.name || "—"}
                sub={
                  topGainer
                    ? `${topGainer.pnl >= 0 ? "+" : ""}${currency(topGainer.pnl)} (${signed(topGainer.pnlPct)})`
                    : "No holdings"
                }
                positive
                icon={<TrendingUpOutlined />}
              />
              <Stat
                title="Worst performer"
                value={topLoser?.name || "—"}
                sub={
                  topLoser
                    ? `${topLoser.pnl >= 0 ? "+" : ""}${currency(topLoser.pnl)} (${signed(topLoser.pnlPct)})`
                    : "No holdings"
                }
                positive={false}
                icon={<TrendingDownOutlined />}
              />
              <Stat
                title="Winners"
                value={pnlRows.filter((r) => r.pnl >= 0).length}
                sub="Holdings currently in profit"
                positive
                icon={<ArrowUpward />}
              />
              <Stat
                title="Losers"
                value={pnlRows.filter((r) => r.pnl < 0).length}
                sub="Holdings currently in loss"
                positive={false}
                icon={<ArrowDownward />}
              />
            </section>

            <section className="content-grid">
              <article className="panel" style={{ minHeight: 340 }}>
                <div className="panel-heading">
                  <h2>P&amp;L by holding</h2>
                  <span>Sorted, best to worst</span>
                </div>
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
                  style={{ maxHeight: 280 }}
                />
              </article>
              <article className="panel" style={{ minHeight: 340 }}>
                <div className="panel-heading">
                  <h2>Allocation</h2>
                </div>
                <Doughnut
                  data={allocation}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "62%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { boxWidth: 10, font: { size: 10 } },
                      },
                    },
                  }}
                  style={{ maxHeight: 260 }}
                />
              </article>
            </section>

            <Table
              title="Your holdings"
              columns={holdingsColumns}
              rows={effectiveHoldings}
              empty="No holdings yet. Use the watchlist to make your first investment."
            />
          </>
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

        {active === "stocks" && (
          <section className="panel table-panel">
            <div className="panel-heading">
              <h2>All stocks</h2>
              <span>{ALL_STOCKS.length} instruments</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th>Sector</th>
                    <th>LTP</th>
                    <th>Chg %</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_STOCKS.map((s) => {
                    const pinned = watchSymbols.includes(s.symbol);
                    return (
                      <tr key={s.symbol}>
                        <td>
                          <b>{s.symbol}</b>
                        </td>
                        <td>{s.name}</td>
                        <td>{s.sector}</td>
                        <td>{currency(s.price)}</td>
                        <td className={s.change >= 0 ? "positive" : "negative"}>
                          {signed(s.change)}
                        </td>
                        <td>
                          <button
                            className={pinned ? "btn btn-grey" : "btn btn-blue"}
                            style={{ padding: "6px 10px", fontSize: 11 }}
                            onClick={() =>
                              pinned ? unpinStock(s.symbol) : pinStock(s.symbol)
                            }
                          >
                            {pinned ? "Remove" : "Add to watchlist"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
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

      {/* WATCHLIST — search to find any stock, pin to add, unpin to remove */}
      <aside className="watch-panel">
        <div className="watch-header">
          <h2>Watchlist</h2>
          <button onClick={() => setWatchQuery("")} aria-label="Clear search">
            <Search />
          </button>
        </div>
        <label className="watch-search">
          <Search />
          <input
            value={watchQuery}
            onChange={(e) => setWatchQuery(e.target.value)}
            placeholder="Search instruments to add"
          />
        </label>

        {searchResults.length > 0 && (
          <div className="watch-search-results">
            {searchResults.map((s) => (
              <article key={s.symbol} className="watch-search-row">
                <div>
                  <b>{s.symbol}</b>
                  <small className="muted" style={{ display: "block" }}>
                    {s.name}
                  </small>
                </div>
                <button
                  aria-label={`Add ${s.symbol} to watchlist`}
                  onClick={() => pinStock(s.symbol)}
                >
                  <PushPinOutlined />
                </button>
              </article>
            ))}
          </div>
        )}

        <div className="watch-items">
          {filteredWatchlist.length === 0 && !watchQuery && (
            <p className="muted" style={{ padding: "0 2px" }}>
              Your watchlist is empty. Search above to add stocks.
            </p>
          )}
          {filteredWatchlist.map((stock) => (
            <article key={stock.symbol}>
              <div>
                <b>{stock.symbol}</b>
                <small className={stock.change >= 0 ? "positive" : "negative"}>
                  {signed(stock.change)}
                </small>
              </div>
              <div className="quote">
                <b>{currency(stock.price)}</b>
                <button
                  className="quick-buy"
                  onClick={() => {
                    setOrder({ ...stock, name: stock.symbol, mode: "BUY" });
                    setOrderForm({ qty: 1, price: stock.price });
                  }}
                >
                  Buy
                </button>
                <button
                  className="quick-sell"
                  onClick={() => {
                    setOrder({ ...stock, name: stock.symbol, mode: "SELL" });
                    setOrderForm({ qty: 1, price: stock.price });
                  }}
                >
                  Sell
                </button>
                <button
                  aria-label={`Remove ${stock.symbol} from watchlist`}
                  onClick={() => unpinStock(stock.symbol)}
                  className="watch-unpin"
                >
                  <PushPin style={{ fontSize: 16 }} />
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
