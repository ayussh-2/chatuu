import { useEffect, useState } from "react";

import Cookies from "js-cookie";

import { UserType } from "@/types/auth/auth";

const useUser = () => {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        const userCookie = Cookies.get("chatuu-user");
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);

    return user;
};

export default useUser;
