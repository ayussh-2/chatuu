import { handleSetLoginCookies } from "@/utils/actions/authHandler";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);

        const token = url.searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { message: "Token not found" },
                { status: 400 }
            );
        }

        const user = await axios.get(
            process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const cookieStatus = await handleSetLoginCookies(token, user.data.data);
        if (!cookieStatus) {
            return NextResponse.json(
                { message: "Failed to set cookies" },
                { status: 500 }
            );
        }
        return NextResponse.redirect(new URL("/chats", request.url));
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
