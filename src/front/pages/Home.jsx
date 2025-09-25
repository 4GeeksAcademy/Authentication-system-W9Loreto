import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterModal from "../components/RegisterModal.jsx";

export default function Home() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [showReg, setShowReg] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLoginError("");

    try {
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env");

      const resp = await fetch(`${backendUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setLoginError(data?.error || "Login failed");
        return;
      }

      // No token handling: on success just go to /private
      navigate("/private");
    } catch (err) {
      setLoginError(err.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 560 }}>
      <h1 className="h3 text-center mb-4">Sign in</h1>

      <form onSubmit={handleLogin} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label htmlFor="loginEmail" className="form-label">Email</label>
          <input
            id="loginEmail"
            type="email"
            className="form-control"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="loginPassword" className="form-label">Password</label>
          <input
            id="loginPassword"
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {loginError && <div className="alert alert-danger py-2">{loginError}</div>}

        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don’t have an account?{" "}
            <button
              type="button"
              className="btn btn-link p-0 align-baseline"
              onClick={() => setShowReg(true)}
            >
              Register now here
            </button>
          </small>
        </div>
      </form>

      {/* Register Modal */}
      <RegisterModal show={showReg} onClose={() => setShowReg(false)} backendUrl={backendUrl} />
    </div>
  );
}
