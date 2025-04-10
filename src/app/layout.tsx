import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import Navbar from "@/components/shared/Navbar";
import DriverNavbar from "@/components/shared/DriverNavbar"; // Import DriverNavbar
import "@/styles/globals.css"; // Import global styles for Tailwind or custom CSS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Waste-ease",
    manifest: "/manifest.json",
    icons: { apple: "/wastelogo.png" },
    description: "Waste-ease for Simplified Waste Management",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Replace with your real auth logic:
    const userRole = "driver"; // Set to "driver" for driver login or "user" for regular user

    return (
        <html lang="en">
            <body className={`${inter.className} bg-white text-black max-w-[100%] md-max-w-[768px] lg-max-w-[1024px] xl-max-w-[1280px] min-h-screen m-auto px-4`}>
                <Toaster position="top-left" />
                <NextTopLoader color="#008000" initialPosition={0.08} crawlSpeed={200} height={3} crawl={true} easing="ease" speed={200} zIndex={1600} showAtBottom={false} />
                {userRole === "driver" ? <DriverNavbar role="driver" /> : <Navbar />}
                {children}
            </body>
        </html>
    );
}
