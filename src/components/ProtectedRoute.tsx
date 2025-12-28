import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth();

  if (!token) {
    // Not logged in, redirect to login
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Logged in, show the page
  return <>{children}</>;
}
