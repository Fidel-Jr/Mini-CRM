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

            if (!res.ok) {
                // await logout();
                return;
            }

            setUser(await res.json());
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // ✅ logout (CORRECT PLACE)
    const logout = async () => {
        setUser(null);
        window.location.href = "/logout";
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