import z from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

const signupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    username: z.string().min(3, "Username must be at least 3 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

const loginFields = [
    {
        name: "email",
        type: "email",
        placeholder: "Email",
    },
    {
        name: "password",
        type: "password",
        placeholder: "Password",
    },
];

const signupFields = [
    {
        name: "name",
        type: "text",
        placeholder: "Name",
    },
    {
        name: "username",
        type: "text",
        placeholder: "Username",
    },
    {
        name: "email",
        type: "email",
        placeholder: "Email",
    },
    {
        name: "password",
        type: "password",
        placeholder: "Password",
    },
];

export { loginSchema, signupSchema, loginFields, signupFields };
