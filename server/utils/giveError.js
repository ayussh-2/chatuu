import mongoose from "mongoose";

export const giveError = (err, res) => {
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map((error) => error.message);
        return res.status(400).json({
            message: "Validation error",
            errors,
            status: "error",
        });
    }
    console.error(err);
    res.status(500).json({ message: "Server error", status: "error" });
};
