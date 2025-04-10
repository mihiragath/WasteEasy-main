"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { useRouter } from "next/navigation";

import SpinLoading from "@/components/loading/SpinLoading";
import { Error } from "@/types/ErrorTypes";
import Toast from "@/utils/toast";
Chart.register(...registerables); // Register necessary controllers
import { Cloud, Edit, Landmark, LogOut, Recycle } from "lucide-react";
import { Lato } from "next/font/google";
import Link from "next/link";
const lato = Lato({ weight: "400", subsets: ["latin"] });
const Page = () => {
    const [user, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [chartInstance, setChartInstance] = useState<any>(null); // State to hold the chart instance

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await fetch(`/api/auth/profile`);
                const data = await response.json();
                console.log(data);
                setUserData(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        };
        getUserData();
    }, []);

    const logout = async () => {
        try {
            await axios.get("/api/auth/logout");
            Toast.SuccessshowToast("Logout Successful");
            router.refresh();
            router.push("/");
        } catch (error: unknown) {
            const Error = error as Error;
            Toast.ErrorShowToast(Error?.response?.data?.error || "Something went wrong");
        }
    };

    const calculateWastePercentage = () => {
        if (!user || !user.userData || !user.userData.wasteDumped) return { recycled: 0, nonRecycled: 0 };

        let recycledCount = 0;
        let totalWasteCount = user.userData.wasteDumped.length;

        user.userData.wasteDumped.forEach((waste: any) => {
            if (waste.isRecyleable) {
                recycledCount++;
            }
        });

        let nonRecycledCount = totalWasteCount - recycledCount;

        return {
            recycled: (recycledCount / totalWasteCount) * 100,
            nonRecycled: (nonRecycledCount / totalWasteCount) * 100,
        };
    };

    useEffect(() => {
        if (user && user.userData && user.userData.wasteDumped) {
            renderChart();
        }
    }, [user]);

    const renderChart = () => {
        const ctx = document.getElementById("wasteChart") as HTMLCanvasElement;
        if (!ctx) return;

        if (chartInstance) {
            chartInstance.destroy(); // Destroy the previous chart instance
        }

        const { recycled, nonRecycled } = calculateWastePercentage() || 0;

        const newChartInstance = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Recycled", "Non-Recycled"],
                datasets: [
                    {
                        data: [recycled, nonRecycled],
                        backgroundColor: ["#259e73", "#F2BF87"],
                        hoverBackgroundColor: ["#a7ebd4", "#2e4a21"],
                    },
                ],
            },
        });

        setChartInstance(newChartInstance); // Save the new chart instance
    };
    // Function to calculate total saved CO2 emissions
    const calculateTotalCO2Saved = () => {
        if (!user || !user.userData || !user.userData.wasteDumped) return 0;

        let totalCO2Saved = 0;

        user.userData.wasteDumped.forEach((waste: any) => {
            // Assuming wasteDumped objects have a property named wastePoints indicating CO2 saved
            totalCO2Saved += waste.wastePoints || 0;
        });

        return totalCO2Saved;
    };
    return (
        <>
            {loading ? (
                <div className="min-h-screen flex justify-center items-center">
                    <SpinLoading />
                </div>
            ) : (
                <div className={`${lato.className} flex flex-col px-4 sm:px-6 md:px-12 min-h-[90vh]`}>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-wide mt-6">Profile</h1>

                    <div className="bg-green-600 rounded-3xl w-full h-auto sm:h-48 mt-8 p-4 sm:p-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-white h-full">
                            <div className="flex flex-col items-center sm:flex-row gap-4 relative">
                                <img src={user.userData?.profilePicture || "https://i.pinimg.com/564x/58/79/29/5879293da8bd698f308f19b15d3aba9a.jpg"} className="w-20 h-20 rounded-xl" alt="Profile" />
                                <div className="text-center sm:text-left">
                                    <h1 className="text-2xl sm:text-3xl font-bold capitalize">{user?.userData?.username}</h1>
                                </div>
                                <Link href={"/edit-profile"} className="absolute top-0 right-0 bg-white p-2 rounded-lg text-black">
                                    <Edit size={17} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="relative mt-12 sm:mt-8">
                        <div className="absolute w-full max-w-5xl mx-auto left-0 right-0">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border-2 border-black/10 text-black shadow-lg shadow-black/10 rounded-xl p-4">
                                {/* Points */}
                                <div className="flex flex-col justify-center items-center">
                                    <div className="border-2 rounded-full p-4 mb-2">
                                        <Landmark size={32} />
                                    </div>
                                    <span className="font-semibold text-lg">{user?.userData?.totalPointsEarned || "0"}</span>
                                    <span className="text-xs uppercase opacity-70 font-semibold tracking-wider">Points</span>
                                </div>
                                {/* CO2 Saved */}
                                <div className="flex flex-col justify-center items-center">
                                    <div className="border-2 rounded-full p-4 mb-2">
                                        <Cloud size={32} />
                                    </div>
                                    <span className="font-semibold text-lg">{calculateTotalCO2Saved() || "0"}G</span>
                                    <span className="text-xs uppercase opacity-70 font-semibold tracking-wider">Saved CO2</span>
                                </div>
                                {/* Recycled */}
                                <div className="flex flex-col justify-center items-center">
                                    <div className="border-2 rounded-full p-4 mb-2">
                                        <Recycle size={32} />
                                    </div>
                                    <span className="font-semibold text-lg">{user?.userData?.wasteDumped?.length || "0"}</span>
                                    <span className="text-xs uppercase opacity-70 font-semibold tracking-wider">Recycled</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white shadow-lg shadow-black/10 rounded-lg border-2 border-black/10 w-full mt-48 sm:mt-32">
                        <div className="w-full flex justify-center items-center p-6">
                            <canvas id="wasteChart" className="max-w-xs sm:max-w-sm md:max-w-md"></canvas>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button onClick={logout} className="flex items-center justify-center gap-4 text-lg font-semibold w-full p-4 rounded-lg mt-5 text-white bg-green-600 hover:bg-green-700 transition-all">
                        <LogOut /> Logout
                    </button>
                </div>
            )}
        </>
    );
};

export default Page;
