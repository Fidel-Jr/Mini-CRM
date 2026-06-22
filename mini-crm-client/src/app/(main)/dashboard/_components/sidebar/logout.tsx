"use client";

import { useAuth } from "@/app/contexts/auth-context";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        // await fetch("/api/auth/logout", {
        //     method: "POST",
        // });
        
        router.push("/login");
        router.refresh();
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}