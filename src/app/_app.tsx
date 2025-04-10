import { useEffect } from "react";
import { useRouter } from "next/router";

const MyApp = ({ Component, pageProps }) => {
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.role === "driver") {
            router.push("/driver");
        } else {
            router.push("/dashboard");
        }
    }, []);

    return <Component {...pageProps} />;
};

export default MyApp;
