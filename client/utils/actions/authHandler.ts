"use server";

import { cookies } from "next/headers";

async function handleLogout() {
    try {
        cookies().set("chatuu-token", "", { expires: new Date(0) });
        cookies().set("chatuu-user", "", { expires: new Date(0) });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function handleSetCookie(name: string, value: string) {
    console.log("Setting cookie " + name + " with value " + value);
    try {
        cookies().set(name, value, {
            secure: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function handleSetLoginCookies(token: string, userData: any) {
    try {
        cookies().set("chatuu-token", token, {
            secure: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
        });

        cookies().set("chatuu-user", JSON.stringify(userData), {
            secure: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
        });

        return true;
    } catch (error) {
        console.error("Error setting cookies:", error);
        return false;
    }
}

export { handleLogout, handleSetCookie, handleSetLoginCookies };
