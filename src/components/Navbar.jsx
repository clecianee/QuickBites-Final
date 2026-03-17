import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, isGuest, clearGuestMode } = useAuth();

  async function handleLogout() {
    try {
      if (!isGuest) {
        await logoutUser();
      }

      clearGuestMode();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  const loggedAs = isGuest ? "Guest" : user?.email || "Unknown User";

  return (
    <nav>
      <span><strong>QuickBites</strong></span>
      {" | "}
      <Link to="/home">Home</Link>
      {" | "}
      <Link to="/search">Search Recipes</Link>
      {" | "}
      <Link to="/my-recipes">My Recipes</Link>
      {" | "}
      <span>Logged as: {loggedAs}</span>
      {" | "}
      <button type="button" onClick={handleLogout}>
        Log Off
      </button>
    </nav>
  );
}

export default Navbar;