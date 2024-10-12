import { loginSchema, signupSchema } from "@/config/auth/auth";
import { UserType } from "@/types/auth/auth";
import { ZodError } from "zod";

export function validateUser(
    user: UserType,
    type: string,
    setErrors: (errors: any) => void
) {
    try {
        setErrors({});

        if (type === "login") {
            loginSchema.parse(user);
        } else {
            signupSchema.parse(user);
        }
        return true;
    } catch (error) {
        if (error instanceof ZodError) {
            const fieldErrors = error.errors.reduce((acc, err) => {
                acc[err.path[0] as string] = err.message;
                return acc;
            }, {} as Record<string, string>);
            setErrors(fieldErrors);

            return false;
        }
        setErrors({ general: "Unexpected error during validation" });
        return false;
    }
}
