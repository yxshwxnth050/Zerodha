import { useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:3002";

function Signup({ login = false }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError(""); setMessage("");
    try {
      const response = await fetch(`${API}/api/auth/${login ? "login" : "register"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(login ? { email: form.email, password: form.password } : form) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Unable to create account");
      localStorage.setItem("kite_token", body.data.token); window.dispatchEvent(new Event("kite-auth"));
      setMessage("Signed in successfully. Open Kite Dashboard from the navigation.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) { setError(err.message === "Failed to fetch" ? `Cannot reach the API at ${API}. Start the Backend service and check REACT_APP_API_URL.` : err.message); } finally { setLoading(false); }
  };
  return <main className="container py-5"><div className="row justify-content-center"><div className="col-md-7 col-lg-5"><p className="text-primary fw-bold small mb-2">{login ? "WELCOME BACK" : "OPEN AN ACCOUNT"}</p><h1 className="mb-3">{login ? "Sign in to Kite." : "Start investing in minutes."}</h1><p className="text-muted mb-4">{login ? "Use your account to continue to the Kite dashboard." : "Create a secure Kite account with zero paperwork in this demo environment."}</p><form className="card border-0 shadow-sm p-4" onSubmit={submit}>{!login && <label className="form-label">Full name<input required minLength="2" className="form-control mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>}<label className="form-label mt-3">Email<input required type="email" className="form-control mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label className="form-label mt-3">Password<input required minLength="8" type="password" className="form-control mt-1" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><small className="text-muted">Use at least 8 characters.</small></label>{error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}{message && <div className="alert alert-success mt-3 mb-0">{message}</div>}<button className="btn btn-primary mt-4" disabled={loading}>{loading ? "Please wait…" : login ? "Login" : "Create account"}</button></form></div></div></main>;
}

export default Signup;
