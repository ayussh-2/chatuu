"use server";
import { jwtVerify } from "jose";
export async function decodeJWT(token: string) {
    if (!token) {
        console.error("No token provided");
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (err) {
        console.error("Error decoding JWT:", err);
    }
}
