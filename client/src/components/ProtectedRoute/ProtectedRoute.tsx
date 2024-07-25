import { Navigate } from "react-router-dom";


interface ProtectedRouteProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}
const ProtectedRoute = ({isAuthenticated, children}: ProtectedRouteProps) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
};

export default ProtectedRoute