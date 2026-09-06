import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usersSelector } from '../../Redux/reducers/usersReducer';

// Waits for the /me session restore call to complete before deciding to
// redirect. This prevents the login flash on page refresh for logged-in users.
const ProtectedRoute = ({ children }) => {
  const { isSignIn, sessionRestored } = useSelector(usersSelector);

  // Session restore in progress — render nothing to avoid flash
  if (!sessionRestored) {
    return null;
  }

  return isSignIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
