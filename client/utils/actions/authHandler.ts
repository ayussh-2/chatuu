"use server";

import { cookies } from "next/headers";

function handleLogout() {
    try {
        cookies().set("chatuu-token", "", { expires: new Date(0) });
        cookies().set("chatuu-user", "", { expires: new Date(0) });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function handleSetCookie(name: string, value: string) {
    try {
        cookies().set(name, value, {
            secure: true,
            // 10 days
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export { handleLogout, handleSetCookie };
