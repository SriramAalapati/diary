import { Navigate } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading,  } = useUser();
  // While checking authentication
  if (loading ) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-700 dark:text-gray-300 font-medium animate-pulse">
          Loading your workspace...
        </div>
      </div>
    );
  }

  // If no user found → redirect to login
  if ( !user ) {
  return <Navigate to="/login"  />;
}


  // If authenticated → show protected content
  return children;
};

export default ProtectedRoute;
