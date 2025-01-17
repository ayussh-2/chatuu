import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/chats", "/logout", "/friends"];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
    const cookie = cookies().get("chatuu-token")?.value;
    const isProtectedRoute = protectedRoutes.includes(req.nextUrl.pathname);
    const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

    if (isProtectedRoute && !cookie) {
        const absoluteUrl = new URL("/", req.nextUrl.origin);
        return NextResponse.redirect(absoluteUrl.toString());
    } else if (isPublicRoute && cookie) {
        const absoluteUrl = new URL("/chats", req.nextUrl.origin);
        return NextResponse.redirect(absoluteUrl.toString());
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/chats", "/", "/logout", "/friends"],
};
