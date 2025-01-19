import jwt from "jsonwebtoken";

export default function decodeToken(token) {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    return decoded;
}
