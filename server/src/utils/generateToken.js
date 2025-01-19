import jwt from "jsonwebtoken";

export default function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
    };

    const secret = process.env.JWT_SECRET;

    const options = {
        expiresIn: "10d",
    };

    const token = jwt.sign(payload, secret, options);
    return token;
}
