"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { LoginFormProps } from "@/types/auth/auth";
import GoogleLogin from "./googleLogin";
import { useState } from "react";
import { validateUser } from "@/utils/validateSchema";
import { loginFields } from "@/config/auth/auth";
import { handleLogin } from "@/utils/actions/authHandler";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoadingButton from "../ui/loading-button";
import { useForm } from "@/hooks/useForm";

export default function LoginForm({ toggleLogin }: LoginFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { formData, errors, setErrors, handleInputChange } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = async () => {
        const isValid = validateUser(formData, "login", setErrors);

        if (isValid) {
            setLoading(true);
            try {
                const loggedIn = await handleLogin(formData);
                if (loggedIn.status !== "error") {
                    toast.success("Login successful");
                    router.push("/chats");
                } else {
                    toast.error(loggedIn.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("An error occurred");
            } finally {
                setLoading(false);
            }
            setLoading(false);
        } else {
            console.log("Form is invalid");
        }
    };
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
            <div className="space-y-4 w-full font-inter">
                {loginFields.map((field) => (
                    <div>
                        <Input
                            key={field.name}
                            placeholder={field.placeholder}
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={
                                formData[field.name as keyof typeof formData]
                            }
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

                <LoadingButton
                    loading={loading}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary"
                >
                    Login
                </LoadingButton>
                <Button
                    variant="link"
                    className="text-center"
                    onClick={toggleLogin}
                >
                    Don't have an account? Sign Up
                </Button>
            </div>
            <hr />
            <GoogleLogin />
        </motion.div>
    );
}
