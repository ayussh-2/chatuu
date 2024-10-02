import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { giveError } from "../utils/giveError.js";
import { config } from "dotenv";
import prisma from "../config/prisma.js";

config();

async function createUser(req, res) {
    const { email, password, name, phone, address } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(200).json({
                message: "Email already in use",
                status: "error",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email,
            name,
            phone,
            password: hashedPassword,
            address,
        });
        await newUser.save();

        return res.status(201).json({
            message: "User created successfully",
            status: "success",
            token: generateToken({ email, password }),
        });
    } catch (err) {
        giveError(err, res);
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User Not Found",
                status: "error",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "User Not Found",
                status: "error",
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "User logged in successfully",
            status: "success",
            token,
        });
    } catch (err) {
        giveError(err, res);
    }
}

async function googleCallback(req, res) {
    const { email, displayName } = req.user;
    const clientURL = process.env.CLIENT_URL;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        res.redirect(
            clientURL + "/auth/google?email=" + email + "&name=" + displayName
        );
    } else {
        const userLogin = await loginGoogleUser(email, res);
        return userLogin;
    }
}

async function createGoogleUser(req, res) {
    const { email, name, phone, address } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use",
                status: "error",
            });
        }

        const otp = generateOTP();

        let password = "google-" + otp;

        password = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            name,
            phone,
            address,
            password,
        });

        await newUser.save();

        const jwt = generateToken(newUser.email, newUser.password);

        return res.status(200).json({
            message: "Registered successfully",
            status: "success",
            data: req.body,
            token: jwt,
        });
    } catch (error) {
        giveError(error, res);
    }
}

async function loginGoogleUser(email, res) {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User Not Found",
                status: "error",
            });
        }
        const token = generateToken(user);
        res.redirect(
            process.env.CLIENT_URL + "/api/googleLogin?token=" + token
        );
    } catch (err) {
        giveError(err, res);
    }
}

async function getUserProfile(req, res) {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User Not Found",
                status: "error",
            });
        }
        res.status(200).json({
            message: "User found",
            status: "success",
            data: user,
        });
    } catch (error) {
        giveError(error, res);
    }
}
export {
    createUser,
    loginUser,
    googleCallback,
    checkOTP,
    createGoogleUser,
    loginGoogleUser,
    getUserProfile,
};
