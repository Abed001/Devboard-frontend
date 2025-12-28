import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { token } = useAuth();

  if (token) {
    // Already logged in, redirect to dashboard
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // Not logged in, show login/signup page
  return <>{children}</>;
}
