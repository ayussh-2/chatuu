import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/chats", "/logout", "/friends"];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
    const cookie = cookies().get("chatuu-token")?.value;
    const user = cookies().get("chatuu-user")?.value;

    const userStatus =
        cookie && user && JSON.parse(user)?.userId ? true : false;

    const isProtectedRoute = protectedRoutes.includes(req.nextUrl.pathname);
    const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

    if (isProtectedRoute && !userStatus) {
        const absoluteUrl = new URL("/", req.nextUrl.origin);
        return NextResponse.redirect(absoluteUrl.toString());
    } else if (isPublicRoute && userStatus) {
        const absoluteUrl = new URL("/chats", req.nextUrl.origin);
        return NextResponse.redirect(absoluteUrl.toString());
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/chats", "/", "/logout", "/friends"],
};
