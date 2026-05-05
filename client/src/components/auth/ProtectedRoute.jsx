import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // admin check
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}