import { Navigate } from "react-router-dom";
import { useProfileQuery } from "../redux/apiSlices/profileSlice";

const ProtectedRoute = ({ children }) => {
  const { data: user } = useProfileQuery();
  console.log("dd", user?.data);
  const isAuthenticated = localStorage.getItem("token");
  console.log("aa", isAuthenticated);

  if (!isAuthenticated && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
