"use client"

import { AppContextType, AppProviderProps, User } from "@/type"
import React, { createContext, useContext, useState } from "react"
import {Toaster} from "react-hot-toast"

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
            <Toaster position="bottom-left" reverseOrder={false} />
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
