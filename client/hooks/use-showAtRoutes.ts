import { routesToShow } from "@/config/hooks";
import { usePathname } from "next/navigation";

const useShowAtRoutes = (): boolean => {
    const pathname = usePathname();

    return routesToShow.some((pattern) => {
        if (typeof pattern === "string") {
            if (pattern.includes(":")) {
                const regexPattern = pattern.replace(/:[\w]+/g, "[\\w-]+");
                return new RegExp(`^${regexPattern}$`).test(pathname);
            }
            return pathname === pattern;
        }
        // Handle regex patterns
        if (pattern instanceof RegExp) {
            return pattern.test(pathname);
        }
        return false;
    });
};

export default useShowAtRoutes;
