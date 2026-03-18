import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
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
        <h1>Register</h1>

        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <br />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <br />
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <div className="auth-actions">
            <button type="submit">Create Account</button>
          </div>
        </form>

        <Link to="/" className="auth-link">
          Back to Login
        </Link>

        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;