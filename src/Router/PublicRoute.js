// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../Authentication/Context/AuthContext";

// const PublicRoute = ({ children }) => {
//     const { auth } = useAuth();

//     return auth ? <Navigate to="/home" /> : children;
// };

// export default PublicRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Authentication/Context/AuthContext";

const PublicRoute = ({ children }) => {
    const { auth } = useAuth();
    return auth ? <Navigate to="/" /> : children;
};

export default PublicRoute;




