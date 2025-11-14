// import React, { createContext, useState } from "react";

// const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
//     const [auth, setAuth] = useState(false);

//     const login = () => setAuth(true);
//     const logout = () => setAuth(false);

//     return (
//         <AuthContext.Provider value={{ auth, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => React.useContext(AuthContext);


// src/Authentication/Context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Set initial state based on sessionStorage
    const [auth, setAuth] = useState(() => {
        return sessionStorage.getItem("auth") === "true";
    });

    const login = () => {
        setAuth(true);
        sessionStorage.setItem("auth", "true");
    };

    const logout = () => {
        setAuth(false);
        sessionStorage.removeItem("auth");
    };

    // Revalidate auth state on mount
    useEffect(() => {
        const storedAuth = sessionStorage.getItem("auth") === "true";
        if (storedAuth) setAuth(true);
    }, []);

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
