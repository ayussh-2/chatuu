export type SignupFormProps = {
    toggleLogin: () => void;
};

export type LoginFormProps = {
    toggleLogin: () => void;
};

export type UserType = {
    email: string;
    password: string;
    username?: string;
    name?: string;
    userId?: number;
};
