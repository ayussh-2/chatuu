"use server";
import { UserType } from "@/types/auth/auth";
import axios from "axios";
import { cookies } from "next/headers";

async function handleAuthRequest(endpoint: string, user?: UserType) {
    try {
        const response = await axios.post(
            `${process.env.API_BASE_URL}/api/auth/${endpoint}`,
            user
        );

        if (response.data.token) {
            const jwt = response.data.token;
            cookies().set("jwt", jwt, {
                secure: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
            });
            return response.data;
        }
        return false;
    } catch (error: any) {
        console.error(error);
        return error.response?.data || null;
    }
}

async function handleLogin({ email, password }: UserType) {
    return handleAuthRequest("login", { email, password });
}

async function handleSignup(user: UserType) {
    return handleAuthRequest("register", user);
}

function handleLogout() {
    try {
        cookies().set("jwt", "", { expires: new Date(0) });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export { handleLogin, handleSignup, handleLogout };
