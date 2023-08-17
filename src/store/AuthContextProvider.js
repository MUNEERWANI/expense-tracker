import AuthContext from "./AuthContext.js";
import React, { useState } from "react";


const AuthContextProvider=(props)=>{

    const[token,setToken]=useState(null);
    const userIsLoggedIn=!!token;
    const loginHandler=(token)=>{
        localStorage.setItem('token',token);
        setToken(token);
    }
    const logoutHandler=()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        setToken(null);
    }
    const contextValue={
        token:token,
        isLoggedIn:userIsLoggedIn,
        login:loginHandler,
        logout:logoutHandler,
    }
    
    return(
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider