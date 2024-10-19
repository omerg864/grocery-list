import { Navigate } from "react-router-dom";


interface UserRestrictedRouteProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}

const UserRestrictedRoute = ({ isAuthenticated, children }: UserRestrictedRouteProps) => {
    if (isAuthenticated) {
      return <Navigate to="/profile" replace />;
    }
  
    return children;
};

export default UserRestrictedRoute