"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { loginFields } from "@/config/auth/auth";
import { useForm } from "@/hooks/useForm";
import { LoginFormProps } from "@/types/auth/auth";
import { validateUser } from "@/utils/validateSchema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import LoadingButton from "../ui/loading-button";
import { useApi } from "@/hooks/use-Api";
import { handleSetLoginCookies } from "@/utils/actions/authHandler";

export default function LoginForm({ toggleLogin }: LoginFormProps) {
    const router = useRouter();
    const { isLoading, makeRequest } = useApi();
    const { formData, errors, setErrors, handleInputChange } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = async () => {
        const isValid = validateUser(formData, "login", setErrors);
        if (isValid) {
            const response = await makeRequest(
                "POST",
                "/auth/login",
                formData,
                "Login failed"
            );
            if (!response || response.status === "error") return;
            const { data } = response;
            const cookieStatus = await handleSetLoginCookies(data.token, data);
            if (!cookieStatus) {
                console.error("Failed to set cookies");
                return;
            }
            router.push("/chats");
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
            className="flex flex-col gap-10 p-2 smd:p-10 smd:w-[26rem]"
        >
            <h2 className="text-4xl font-semibold text-center font-syne">
                Welcome Back!
            </h2>
            <div className="space-y-4 w-full font-inter">
                {loginFields.map((field) => (
                    <div key={field.name}>
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
                    loading={isLoading}
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="btn-primary bg-black  dark:bg-white"
                >
                    Login
                </LoadingButton>

                <Button
                    variant="link"
                    className="text-center"
                    onClick={toggleLogin}
                >
                    Don&apos;t have an account? Sign Up
                </Button>
            </div>
            <hr />
            {/* <GoogleLogin /> */}
        </motion.div>
    );
}
