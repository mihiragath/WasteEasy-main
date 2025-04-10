"use client";

import React, { useState } from "react";
import { ClockLoader } from "react-spinners";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { stateandcity } from "@/assets/StateList";
import useDebounce from "@/hooks/debounce";
import { Error } from "@/types/ErrorTypes";
import Toast from "@/utils/toast";
import "@/styles/globals.css"; // Import global styles for Tailwind or custom CSS

const Page = () => {
    const router = useRouter();
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [passwordMismatch, setPasswordMismatch] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedState, setSelectedState] = useState<string>("");
    const [citySelected, setCitySelected] = useState<string>("");
    const [cities, setCities] = useState<string[]>([]);
    const [role, setRole] = useState<string>("user");
    const [vehicleType, setVehicleType] = useState<string>("");
    const [vehicleNumber, setVehicleNumber] = useState<string>("");

    const handlePasswordChange = useDebounce((value) => {
        setPassword(value);
        if (confirmPassword && confirmPassword !== value) {
            setPasswordMismatch(true);
        } else {
            setPasswordMismatch(false);
        }
    }, 800);

    const handleConfirmPasswordChange = useDebounce((value) => {
        setConfirmPassword(value);
        if (password && password !== value) {
            setPasswordMismatch(true);
        } else {
            setPasswordMismatch(false);
        }
    }, 800);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const UserData = {
                username: userName,
                email: email,
                password: password,
                state: selectedState,
                city: citySelected,
                role,
                driverDetails: role === "driver" ? { vehicleType, vehicleNumber } : null,
            };
            const res = await axios.post("/api/auth/register", UserData);
            if (res) {
                Toast.SuccessshowToast(`Email sent to ${email} please verify` || "Something went wrong");
            } else {
                Toast.ErrorShowToast("Something went wrong");
            }
            router.push(role === "driver" ? "/driver" : "/dashboard");
        } catch (error: unknown) {
            const Error = error as Error;
            console.log(Error);
            Toast.ErrorShowToast(Error?.response?.data?.error || "Something went wrong");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const state = event.target.value;
        setSelectedState(state);
        setCities(stateandcity[state as keyof typeof stateandcity]);
    };

    return (
        <>
            <Link href={"/login"} className="font-bold text-lg p-4 flex items-center gap-2">
                <ArrowLeft />
                <h1>Back</h1>
            </Link>
            <section className="flex min-h-[80vh] justify-center items-center px-4">
                <div className="border-2 border-black/10 shadow-md shadow-black/10 w-full max-w-[500px] p-4 rounded-lg">
                    <h1 className="font-semibold text-2xl text-left mb-5">Create Your Account</h1>
                    <form autoComplete="false" className="flex flex-col gap-4" onSubmit={handleRegister}>
                        <label htmlFor="text" className="text-sm font-medium">
                            Username
                        </label>
                        <input type="text" placeholder="Username" className="bg-transparent border-2 border-black/20 p-2 focus:outline-none focus:border-green-800 duration-200 rounded-lg text-black" onChange={(e) => setUserName(e.target.value)} />
                        <label htmlFor="Email" className="text-sm font-medium">
                            Email
                        </label>
                        <input type="email" placeholder="Email" className="bg-transparent border-2 border-black/20 p-2 focus:outline-none focus:border-green-800 duration-200 rounded-lg text-black" onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="text" className="text-sm font-medium">
                            Enter Your State
                        </label>
                        <select onChange={handleStateChange} className="bg-transparent border-2 border-black/20 p-2 focus:outline-none focus:border-green-800 duration-200 rounded-lg text-black">
                            {Object.keys(stateandcity).map((state) => (
                                <option value={state} key={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="text" className="text-sm font-medium">
                            Enter Your City
                        </label>
                        <select onChange={(e) => setCitySelected(e.target.value)} className="bg-transparent border-2 border-black/20 p-2 focus:outline-none focus:border-green-800 duration-200 rounded-lg text-black">
                            {cities.map((city, index) => (
                                <option value={city} key={index}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="role" className="text-sm font-medium">
                            Select Role
                        </label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="bg-transparent border-2 border-black/20 p-2 focus:outline-none focus:border-green-800 duration-200 rounded-lg text-black">
                            <option value="user">User</option>
                            <option value="driver">Driver</option>
                        </select>
                        {role === "driver" && (
                            <>
                                <label htmlFor="vehicleType" className="text-sm font-medium">
                                    Vehicle Type
                                </label>
                                <input type="text" placeholder="e.g., Truck, Van" className="bg-transparent border-2 border-black/20 p-2 focus:outline-none focus:border-green-800 duration-200 rounded-lg text-black" onChange={(e) => setVehicleType(e.target.value)} />
                                <label htmlFor="vehicleNumber" className="text-sm font-medium">
                                    Vehicle Number
                                </label>
                                <input type="text" placeholder="e.g., ABC-1234" className="bg-transparent border-2 border-black/20 p-2 focus:outline-none focus:border-green-800 duration-200 rounded-lg text-black" onChange={(e) => setVehicleNumber(e.target.value)} />
                            </>
                        )}
                        <label htmlFor="Password" className="text-sm font-medium">
                            Password
                        </label>
                        <div className={`flex justify-between items-center border-2 text-black rounded-lg ${passwordMismatch ? "border-red-500" : "border-black/20"} p-2`}>
                            <input type={`${showPassword ? "text" : "password"}`} placeholder="Enter a password" className="w-[90%] bg-transparent focus:outline-none" onChange={(e) => handlePasswordChange(e.target.value)} />
                            {showPassword ? <EyeOff onClick={() => setShowPassword(!showPassword)} /> : <Eye onClick={() => setShowPassword(!showPassword)} />}
                        </div>
                        <label htmlFor="password" className="text-sm font-medium">
                            Confirm Password
                        </label>
                        <div className={`flex justify-between items-center border-2 rounded-lg text-black ${passwordMismatch ? "border-red-500" : "border-black/20"} p-2`}>
                            <input type={`${showConfirmPassword ? "text" : "password"}`} placeholder="Enter a password" className="w-[90%] bg-transparent focus:outline-none" onChange={(e) => handleConfirmPasswordChange(e.target.value)} />
                            {showConfirmPassword ? <EyeOff onClick={() => setShowConfirmPassword(!showConfirmPassword)} /> : <Eye onClick={() => setShowConfirmPassword(!showConfirmPassword)} />}
                        </div>
                        {passwordMismatch && <span className="text-red-500 font-semibold text-sm">Password Didn&apos;t Match</span>}
                        {password && confirmPassword.length < 8 && <span className="text-red-500 font-semibold text-sm">Password should have at least 8 characters</span>}
                        {loading ? (
                            <button className="font-semibold flex gap-3 p-3 bg-green-600 text-white rounded-lg items-center justify-center" disabled={true}>
                                <ClockLoader size={25} color="#fff" />
                                <span>Registering...</span>
                            </button>
                        ) : (
                            <button className={`p-3 ${userName && email && password && confirmPassword !== "" && password === confirmPassword ? "bg-green-600 text-white cursor-pointer" : "bg-black/30 text-white cursor-not-allowed"} rounded-lg mt-3 font-semibold duration-200 hover:bg-green-500 hover:text-white`}>Register</button>
                        )}
                        <span className="text-center mt-2 text-sm">
                            Already have an account?{" "}
                            <Link href={"/login"} className="text-green-600">
                                Login
                            </Link>
                        </span>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Page;
