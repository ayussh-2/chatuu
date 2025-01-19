import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
// import { handleSetLoginCookies } from "@/utils/actions/authHandler";

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
            process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/auth/profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return NextResponse.json(user.data.data);

        // if (!user.data) {
        //     return NextResponse.json(
        //         { message: "User not found" },
        //         { status: 404 }
        //     );
        // }

        // console.log("User data:", user.data.data);

        // const cookieStatus = await handleSetLoginCookies(token, user.data.data);

        // return NextResponse.redirect(new URL("/chats", request.url));
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
