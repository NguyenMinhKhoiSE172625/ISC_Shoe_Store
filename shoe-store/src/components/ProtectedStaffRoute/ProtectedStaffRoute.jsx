import { Navigate } from 'react-router-dom';
import { USER_ROLES } from '../../constants/userRoles';

const ProtectedStaffRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!currentUser || currentUser.role !== USER_ROLES.STAFF) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedStaffRoute; 