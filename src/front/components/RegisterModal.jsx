import React, { useState } from "react";

export default function RegisterModal({ show, onClose, backendUrl }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  if (!show) return null;

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setSubmitting(false);
    setError("");
    setOk(false);
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setOk(false);

    try {
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env");

      const resp = await fetch(`${backendUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data?.error || "Registration failed");
      } else {
        setOk(true);
        setTimeout(() => handleClose(), 900);
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal d-block show"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: "rgba(0,0,0,.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Create account</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
              {ok && <div className="alert alert-success py-2 mb-3">Registered! You can sign in now.</div>}

              <div className="mb-3">
                <label htmlFor="regEmail" className="form-label">Email</label>
                <input
                  id="regEmail"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={submitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="regPassword" className="form-label">Password</label>
                <input
                  id="regPassword"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={handleClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Creating..." : "Sign up"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
