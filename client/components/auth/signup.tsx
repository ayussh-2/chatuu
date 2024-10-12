"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { SignupFormProps } from "@/types/auth/auth";

export default function SignupForm({ toggleLogin }: SignupFormProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            key="signup"
            className="flex flex-col gap-10 backdrop-blur-sm p-10 w-[26rem]"
        >
            <h2 className="text-4xl font-semibold text-center font-syne">
                Sign Up
            </h2>
            <form className="space-y-4 w-full font-inter">
                <Input id="firstname" placeholder="Your Name" type="text" />
                <Input placeholder="Email" type="email" />
                <Input
                    placeholder="Password"
                    type="password"
                    className="py-5"
                />
                <Button type="submit" className="btn-primary">
                    Sign Up
                </Button>
                <Button
                    variant="link"
                    className="text-center"
                    onClick={toggleLogin}
                >
                    Already have an account? Login
                </Button>
            </form>
            <hr />
            <Button variant="ghost" className="text-center">
                Continue with Google
            </Button>
        </motion.div>
    );
}
