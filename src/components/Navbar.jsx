import icon from "../images/icon.png";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

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
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <img src={icon} alt="QuickBites icon" className="navbar-icon" />
          <span className="navbar-logo">QuickBites</span>
        </div>
        <NavLink to="/home" className="navbar-link">Home</NavLink>
        <NavLink to="/search" className="navbar-link">Search Recipes</NavLink>
        <NavLink to="/my-recipes" className="navbar-link">My Recipes</NavLink>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">Logged as: {loggedAs}</span>
        <button type="button" className="navbar-button" onClick={handleLogout}>
          Log Off
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
