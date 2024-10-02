import jwt from "jsonwebtoken";

function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
    };

    const secret = process.env.JWT_SECRET;

    const options = {
        expiresIn: "10d",
    };

    const token = jwt.sign(payload, secret, options);
    return token;
}

export { generateToken };
