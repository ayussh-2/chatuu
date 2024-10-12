import { useState } from "react";
export const useForm = <T extends Record<string, any>>(initialState: T) => {
    const [formData, setFormData] = useState<T>(initialState);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        handleInputChange,
    };
};
