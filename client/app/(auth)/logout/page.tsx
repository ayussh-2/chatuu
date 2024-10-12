"use client";
import React from "react";
import { useLayoutEffect } from "react";
import { handleLogout } from "@/utils/actions/authHandler";
export default function Page() {
    useLayoutEffect(() => {
        handleLogout();
    });
    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    );
}
