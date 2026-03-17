import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, isGuest, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user && !isGuest) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;