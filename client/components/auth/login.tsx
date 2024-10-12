"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { LoginFormProps } from "@/types/auth/auth";

export default function LoginForm({ toggleLogin }: LoginFormProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            key="login"
            className="flex flex-col gap-10 backdrop-blur-sm p-10 w-[26rem]"
        >
            <h2 className="text-4xl font-semibold text-center font-syne">
                Welcome Back!
            </h2>
            <form className="space-y-4 w-full font-inter">
                <Input placeholder="Email" type="email" />
                <Input
                    placeholder="Password"
                    type="password"
                    className="py-5"
                />
                <Button type="submit" className="btn-primary">
                    Login
                </Button>
                <Button
                    variant="link"
                    className="text-center"
                    onClick={toggleLogin}
                >
                    New here? Signup
                </Button>
            </form>
            <hr />
            <Button variant="ghost" className="text-center">
                Continue with Google
            </Button>
        </motion.div>
    );
}
