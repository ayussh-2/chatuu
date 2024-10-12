export type SignupFormProps = {
    toggleLogin: () => void;
    handleSignup: ({
        email,
        password,
        username,
        name,
    }: UserType) => Promise<Boolean>;
};

export type LoginFormProps = {
    toggleLogin: () => void;
    handleLogin: ({ email, password }: UserType) => Promise<Boolean>;
};

export type UserType = {
    email: string;
    password: string;
    username?: string;
    name?: string;
};
