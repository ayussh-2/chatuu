"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { SignupFormProps } from "@/types/auth/auth";
import GoogleLogin from "./googleLogin";
import { signupFields } from "@/config/auth/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateUser } from "@/utils/validateSchema";
import toast from "react-hot-toast";
import { handleSignup } from "@/utils/actions/authHandler";

export default function SignupForm({ toggleLogin }: SignupFormProps) {
    const [user, setUser] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const isValid = validateUser(user, "signup", setErrors);

        if (isValid) {
            const signUp = await handleSignup(user);
            if (signUp.status !== "error") {
                toast.success("Sign up successful");
                router.push("/chats");
            } else {
                toast.error(signUp.message);
            }
        } else {
            console.log("Form validation failed");
        }
    };
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
            <div className="space-y-4 w-full font-inter">
                {signupFields.map((field) => (
                    <div>
                        <Input
                            key={field.name}
                            placeholder={field.placeholder}
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={user[field.name as keyof typeof user]}
                            onChange={handleInputChange}
                            className={
                                errors[field.name as keyof typeof errors] &&
                                "border-red-500"
                            }
                        />
                        {errors[field.name as keyof typeof errors] && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors[field.name as keyof typeof errors]}
                            </p>
                        )}
                    </div>
                ))}
                <Button
                    type="submit"
                    className="btn-primary"
                    onClick={handleSubmit}
                >
                    Sign Up
                </Button>
                <Button
                    variant="link"
                    className="text-center"
                    onClick={toggleLogin}
                >
                    Already have an account? Login
                </Button>
            </div>
            <hr />
            <GoogleLogin />
        </motion.div>
    );
}
