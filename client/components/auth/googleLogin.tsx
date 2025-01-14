import React from "react";
import { Button } from "../ui/button";

async function handleGoogleLogin() {
    try {
        console.log(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/google");
        window.location.href =
            process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/google";
    } catch (e) {
        console.error(e);
    }
}
export default function GoogleLogin() {
    return (
        <Button
            variant="ghost"
            className="text-center"
            onClick={handleGoogleLogin}
        >
            Continue with Google
        </Button>
    );
}
