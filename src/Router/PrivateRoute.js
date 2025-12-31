// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../Authentication/Context/AuthContext";

// const PrivateRoute = ({ children }) => {
//     const { auth } = useAuth();
//     return auth ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;

import { useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/Context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const initialCheckRef = useRef(true);

  useEffect(() => {
    if (!auth) {
      sessionStorage.removeItem('allowedPath');
      return;
    }

    if (initialCheckRef.current) {
      initialCheckRef.current = false;

      const storedPath = sessionStorage.getItem('allowedPath');

      if (!storedPath) {
        sessionStorage.setItem('allowedPath', location.pathname);
      } else {
        if (location.pathname !== storedPath) {
          navigate(storedPath, { replace: true });
        }
      }

      return;
    }

    sessionStorage.setItem('allowedPath', location.pathname);
  }, [auth, location, navigate]);

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
