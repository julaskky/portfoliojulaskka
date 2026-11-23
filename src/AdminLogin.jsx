import { useState } from "react";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost/portfoliojulaskka/api/admin-login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to sign in.");
      }

      window.location.href = "/admin-dashboard";
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Check XAMPP and the API settings."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-glow admin-login-glow-one" />
      <div className="admin-login-glow admin-login-glow-two" />

      <a className="admin-brand" href="/">
        <span className="admin-brand-mark">J.</span>
        <span>
          <strong>JULIUS</strong>
          <small>PORTFOLIO ADMIN</small>
        </span>
      </a>

      <section className="admin-login-layout">
        <div className="admin-login-intro">
          <span className="admin-eyebrow">
            <span className="admin-status-dot" />
            PRIVATE ADMINISTRATOR ACCESS
          </span>

          <h1>
            Ideas become
            <br />
            <span>impact.</span>
          </h1>

          <p>
            Manage projects, showcase innovation, and keep your
            professional portfolio up to date.
          </p>

          <div className="admin-login-note">
            <span className="admin-note-icon">✳</span>
            <div>
              <strong>Your work. Your platform.</strong>
              <small>A dedicated space for managing your digital presence.</small>
            </div>
          </div>
        </div>

        <div className="admin-login-card">
          <div className="admin-card-icon">↗</div>
          <span className="admin-card-kicker">WELCOME BACK</span>
          <h2>Admin sign in</h2>
          <p className="admin-card-description">
            Enter your administrator credentials to continue.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />

            <div className="admin-password-label">
              <label htmlFor="admin-password">Password</label>
            </div>

            <div className="admin-password-field">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && <div className="admin-login-error">{error}</div>}

            <button
              className="admin-submit-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in securely"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="admin-security-note">
            <span>▣</span>
            Protected administrator access
          </div>
        </div>
      </section>

      <footer className="admin-login-footer">
        <span>© {new Date().getFullYear()} Julius Portfolio</span>
        <a href="/">← Return to portfolio</a>
      </footer>
    </main>
  );
}
