import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);

        const token = url.searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { message: "Token not found" },
                { status: 400 }
            );
        }
        cookies().set("jwt", token, { secure: true });
        return NextResponse.redirect(new URL("/chats", request.url));
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
