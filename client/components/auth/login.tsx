"use client";
import { motion } from "framer-motion";

const formAnimation = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    transition: {
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
    },
};

export default function LoginForm() {
    return (
        <motion.div
            initial={formAnimation.initial}
            animate={formAnimation.animate}
            transition={formAnimation.transition}
            className="mt-8 max-w-md mx-auto p-6 bg-white shadow-md rounded-md"
        >
            <h2 className="text-2xl font-semibold text-center">Login</h2>
            <form className="mt-6 space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded-md"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded-md"
                />
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-600 text-white rounded-md"
                >
                    Login
                </button>
            </form>
        </motion.div>
    );
}
