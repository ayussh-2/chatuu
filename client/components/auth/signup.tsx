"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { SignupFormProps, UserType } from "@/types/auth/auth";
import GoogleLogin from "./googleLogin";
import { signupFields } from "@/config/auth/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateUser } from "@/utils/validateSchema";
import toast from "react-hot-toast";
import { handleSignup } from "@/utils/actions/authHandler";
import LoadingButton from "../ui/loading-button";
import { useForm } from "@/hooks/useForm";

export default function SignupForm({ toggleLogin }: SignupFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { formData, errors, setErrors, handleInputChange } = useForm({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit = async () => {
        const isValid = validateUser(formData, "signup", setErrors);

        if (isValid) {
            setLoading(true);
            try {
                const signUp = await handleSignup(formData);
                if (signUp.status !== "error") {
                    toast.success("Sign up successful");
                    localStorage.setItem(
                        "loggedInChatuuUser",
                        JSON.stringify(signUp.user)
                    );
                    router.push("/chats");
                } else {
                    toast.error(signUp.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("An error occurred");
            } finally {
                setLoading(false);
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
                            value={formData[field.name as keyof UserType]}
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
                    Sign Up
                </LoadingButton>
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
