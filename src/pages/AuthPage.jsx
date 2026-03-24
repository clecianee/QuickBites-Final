import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import logo from "../images/logo.png";
import "../styles/auth.css";

function AuthPage() {
  const navigate = useNavigate();
  const { user, isGuest, continueAsGuest, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (user || isGuest)) {
      navigate("/home");
    }
  }, [user, isGuest, loading, navigate]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    try {
      await loginUser(email, password);
      navigate("/home");
    } catch (err) {
      setError(`Login failed: ${err.code}`);
      console.error(err);
    }
  }

  function handleGuestAccess() {
    continueAsGuest();
    navigate("/home");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="QuickBites logo" className="auth-logo" />

        <h1 className="auth-title">QuickBites</h1>
        <p className="auth-subtitle">Login, register, or continue as guest</p>

        <form className="auth-form" onSubmit={handleLogin}>
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

          <button type="submit" className="auth-button auth-button-primary">
            Login
          </button>
        </form>

        <div className="auth-actions">
          <Link to="/register" className="auth-link-wrapper">
            <button type="button" className="auth-button auth-button-secondary">
              Register
            </button>
          </Link>

          <button
            type="button"
            className="auth-button auth-button-guest"
            onClick={handleGuestAccess}
          >
            Continue as Guest
          </button>
        </div>

        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  );
}

export default AuthPage;