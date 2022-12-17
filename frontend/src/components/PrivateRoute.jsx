import { useLocation, Navigate } from 'react-router-dom';

export const PrivateComponent = ({ children }) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const { pathname } = useLocation();
  return token ? children : <Navigate to="/messager/login" state={{ from: pathname }} replace />;
};
