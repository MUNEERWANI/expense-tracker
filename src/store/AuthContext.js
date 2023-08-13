import { createContext } from "react";

const AuthContext=createContext({
    token:null,
    isLoggedin:false,
    login:()=>{},
    logout:()=>{},
})
export default AuthContext;