import { useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface ApiResponse {
    message?: string;
    [key: string]: any;
}

export const useApi = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const makeRequest = async (
        method: "GET" | "POST" | "PUT" | "DELETE",
        endpoint: string,
        data?: any,
        errorMessage: string = "Request failed",
        tokenReq: boolean = false
    ): Promise<ApiResponse | null> => {
        setIsLoading(true);

        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const url = `${API_URL}${endpoint}`;
        const token = Cookies.get("quick-serve-token");

        if (tokenReq && !token) {
            toast.error("Please login again to continue!");
            setIsLoading(false);
            return {
                status: "error",
                data: null,
            };
        }

        const headers: AxiosRequestConfig["headers"] = {
            "Content-Type": "application/json",
            ...(tokenReq && { Authorization: `Bearer ${token ? token : ""}` }),
        };

        try {
            const response: AxiosResponse<ApiResponse> = await axios.request({
                method,
                url,
                data,
                headers,
            });

            if (response.status !== 200 && response.status !== 201) {
                console.error("API response error", response.data.message);
                toast.error(response.data.message || errorMessage);
                return {
                    status: "error",
                    data: null,
                };
            }

            toast.success(response.data.message || "Request successful");
            return {
                status: "success",
                data: response.data?.data,
            };
        } catch (error: any) {
            console.error("API catch error", error);

            toast.error(
                error?.response?.data?.message
                    ? error?.response?.data?.message
                    : errorMessage
            );
            return {
                status: "error",
                data: null,
            };
        } finally {
            setIsLoading(false);
        }
    };

    return { makeRequest, isLoading };
};
