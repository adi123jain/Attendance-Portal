import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Authentication/Context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { auth } = useAuth();
    return auth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

// import React, { useEffect, useRef } from "react";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../Authentication/Context/AuthContext";

// const PrivateRoute = ({ children }) => {
//   const { auth } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   // used to run initial-check logic only once per mount
//   const initialCheckRef = useRef(true);

//   useEffect(() => {
//     // If user is not authenticated, clear stored path and skip checks
//     if (!auth) {
//       sessionStorage.removeItem("allowedPath");
//       return;
//     }

//     // Run the initial-page-load check only once (when component mounts)
//     if (initialCheckRef.current) {
//       initialCheckRef.current = false;

//       const storedPath = sessionStorage.getItem("allowedPath");

//       if (!storedPath) {
//         // No stored path yet: store the first valid route the user opened
//         sessionStorage.setItem("allowedPath", location.pathname);
//         // allow this route
//       } else {
//         // If there is an allowed path and current loaded URL is different,
//         // this likely means the user opened the app by typing/pasting a URL
//         // or reloaded to a different path — redirect back to stored allowed path.
//         if (location.pathname !== storedPath) {
//           navigate(storedPath, { replace: true });
//         }
//       }

//       return; // done with initial-check
//     }

//     // --- subsequent location changes (client-side) come here ---
//     // Update allowedPath on client-side navigations (button/link) so user
//     // can freely move inside the app. This prevents blocking legit in-app navigation.
//     sessionStorage.setItem("allowedPath", location.pathname);
//   }, [auth, location, navigate]);

//   // keep original auth logic intact
//   if (!auth) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;



