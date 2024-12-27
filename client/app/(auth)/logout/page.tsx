"use client";
import React from "react";
import { useLayoutEffect } from "react";
import { handleLogout } from "@/utils/actions/authHandler";
import Cookies from "js-cookie";
export default function Page() {
    useLayoutEffect(() => {
        const loggedOut = logOutUser();
        if (loggedOut) {
            window.location.href = "/";
        }
    });

    function logOutUser() {
        const status = handleLogout();
        if (status) {
            Cookies.remove("chatuu-user");
        }
        return status;
    }

    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    );
}
