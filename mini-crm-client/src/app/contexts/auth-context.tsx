"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { User } from "../../../types/user";


type AuthContextType = {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export function AuthProvider({
    children
}: {
    children: React.ReactNode;
}) {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ✅ fetch current user
    const refreshUser = async () => {
        try {
            const res = await fetch("/api/auth/me");

            // if (!res.ok) {
            //     setUser(null);
            //     return;
            // }

            if(res.status===401){

            const refresh = await fetch(
                "/api/auth/refresh",
                {
                    method:"POST"
                }
                );

                if(refresh.ok){


                    return refreshUser();

                }
                await logout();
            }

            const data = await res.json();
            setUser(data);

        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // ✅ logout (CORRECT PLACE)
    const logout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
        });

        setUser(null);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);