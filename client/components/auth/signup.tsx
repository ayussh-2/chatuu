"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { SignupFormProps, UserType } from "@/types/auth/auth";
import { signupFields } from "@/config/auth/auth";
import { useRouter } from "next/navigation";
import { validateUser } from "@/utils/validateSchema";
import { handleSetLoginCookies } from "@/utils/actions/authHandler";
import LoadingButton from "../ui/loading-button";
import { useForm } from "@/hooks/useForm";
import { useApi } from "@/hooks/use-Api";

export default function SignupForm({ toggleLogin }: SignupFormProps) {
    const router = useRouter();
    const { isLoading, makeRequest } = useApi();
    const { formData, errors, setErrors, handleInputChange } = useForm({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit = async () => {
        const isValid = validateUser(formData, "signup", setErrors);

        if (isValid) {
            const response = await makeRequest(
                "POST",
                "/auth/signup",
                formData,
                "Signup failed"
            );
            if (!response || response.status === "error") return;
            const { data } = response;

            handleSetLoginCookies(data.token, data);
            router.push("/chats");
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
            className="flex flex-col gap-10 backdrop-blur-sm p-2 smd:p-10 smd:w-[26rem]"
        >
            <h2 className="text-4xl font-semibold text-center font-syne">
                Sign Up
            </h2>
            <div className="space-y-4 w-full font-inter">
                {signupFields.map((field) => (
                    <div key={field.name}>
                        <Input
                            key={field.name}
                            placeholder={field.placeholder}
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            // @ts-expect-error - type errors
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
                    loading={isLoading}
                    onClick={handleSubmit}
                    disabled={isLoading}
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
            {/* <GoogleLogin /> */}
        </motion.div>
    );
}
