// lib/auth.ts

import { cookies } from 'next/headers';
import { apiFetch } from './api';

export async function getUser() {
    const token = (await cookies())
        .get('access_token')
        ?.value;

        console.log("Token exists:", !!token);
        console.log("Token:", token);


    if (!token) {
        return null;
    }

    const res = await apiFetch(
        "/api/Auth/me"
    );

    if (!res.ok) {
        console.log("Not Ok")
        return null;
    }

    return res.json();
}