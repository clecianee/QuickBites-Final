import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import logo from "../images/logo.png";
import "../styles/auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { clearGuestMode } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await registerUser(email, password);
      clearGuestMode();
      navigate("/home");
    } catch (err) {
      console.error("Firebase register error:", err);
      setError(`Registration failed: ${err.code}`);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="QuickBites logo" className="auth-logo" />

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join QuickBites and start saving recipes</p>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword" className="auth-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="auth-input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button auth-button-primary"
          >
            Create Account
          </button>
        </form>

        <div className="auth-actions">
          <Link to="/" className="auth-link-wrapper">
            <button
              type="button"
              className="auth-button auth-button-secondary"
            >
              Back to Login
            </button>
          </Link>
        </div>

        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;