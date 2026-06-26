"use client";

import { useEffect, useState } from "react";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
    createdAt: string;
}

export default function ProfileSection() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/me", {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => setUser(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-muted-foreground">
                    Loading profile...
                </p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6">
                <p className="text-red-500">
                    Unable to load profile.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">

            <div className="rounded-2xl border bg-background shadow-sm">

                {/* Header */}
                <div className="h-32 rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-600" />

                <div className="px-8 pb-8">

                    {/* Avatar */}
                    <div className="-mt-12">

                        <div className="flex items-center gap-6">

                            <div className="h-24 w-24 rounded-full border-4 border-background bg-muted flex items-center justify-center text-3xl font-bold">

                                {user.firstName[0]}
                                {user.lastName[0]}

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold">

                                    {user.firstName} {user.lastName}

                                </h1>

                                <p className="text-muted-foreground">

                                    {user.email}

                                </p>

                                <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">

                                    {user.role}

                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Information */}
                    <div className="mt-8 grid md:grid-cols-2 gap-6">

                        <div className="rounded-xl border p-4">

                            <h3 className="font-semibold mb-4">
                                Account Information
                            </h3>

                            <div className="space-y-3">

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        User ID
                                    </p>

                                    <p>{user.id}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Email
                                    </p>

                                    <p>{user.email}</p>
                                </div>

                            </div>

                        </div>

                        <div className="rounded-xl border p-4">

                            <h3 className="font-semibold mb-4">
                                Membership
                            </h3>

                            <div className="space-y-3">

                                <div>

                                    <p className="text-sm text-muted-foreground">
                                        Joined
                                    </p>

                                    <p>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-muted-foreground">
                                        Role
                                    </p>

                                    <p>{user.role}</p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex gap-3">

                        <button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">

                            Edit Profile

                        </button>

                        <button className="rounded-lg border px-4 py-2">

                            Change Password

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}