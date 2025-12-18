"use client"

import { AppContextType, AppProviderProps, User } from "@/type"
import React, { createContext, useContext, useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import Cookies from "js-cookie"
import axios from "axios"

export const auth_service = "http://localhost:5000"
export const utils_service = "http://localhost:5001"
export const user_service = "http://localhost:5002"
export const job_service = "http://localhost:5003"

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);

    const token = Cookies.get("token");

    async function fetchUser(token: string) {
        setLoading(true);
        try {
            const { data } = await axios.get(`${user_service}/api/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(data.data);
            setIsAuth(true);
        } catch (error) {
            setUser(null);
            setIsAuth(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser(token as string);
    }, []);

    const value = {
        user,
        loading,
        btnLoading,
        isAuth,
        setUser,
        setLoading,
        setIsAuth
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
        </AppContext.Provider>
    )
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppData must be used within an AppProvider");
    }
    return context;
}

export default AppContext;
