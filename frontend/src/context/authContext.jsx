import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        axios.get("/auth/profile")
        .then(res => setUser(res.data.user))
        .catch(()=>setUser(null))
        .finally(() =>setLoading(false));
    }, []);

    const logout = async()=>{
        try {
            await axios.post("/auth/logout");
            toast.success("Logged out successfully")
            setUser(null);
        } catch (error) {
            toast.error("Logout failed!")
        }
    }

    return (
        <AuthContext.Provider value = {{user, setUser, loading, logout}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);