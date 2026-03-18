import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../images/logo.png";
import icon from "../images/icon.png";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <Link to="/home" className="logo-link">
          <img src={logo} alt="QuickBites Logo" className="logo" />
          <span className="logo-text">QuickBites</span>
        </Link>
      </div>

      {/* Center: Links */}
      <div className="navbar-center">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/search" className="nav-link">Search</Link>
        <Link to="/my-recipes" className="nav-link">My Recipes</Link>
      </div>

      {/* Right: optional icon */}
      <div className="navbar-right">
        <img src={icon} alt="App Icon" className="nav-icon" />
      </div>
    </nav>
  );
}

export default Navbar;
