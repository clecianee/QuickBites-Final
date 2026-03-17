import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

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
    <div>
      <h1>QuickBites</h1>
      <p>Login, Register, or Continue as Guest</p>

      <form onSubmit={handleLogin}>
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

        <br />

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

        <br />

        <button type="submit">Login</button>
      </form>

      <br />

      <Link to="/register">
        <button type="button">Register</button>
      </Link>

      <br />
      <br />

      <button type="button" onClick={handleGuestAccess}>
        Continue as Guest
      </button>

      {error && (
        <>
          <br />
          <br />
          <p>{error}</p>
        </>
      )}
    </div>
  );
}

export default AuthPage;