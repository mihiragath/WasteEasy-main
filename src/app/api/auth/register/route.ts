import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { connect } from "@/database/db";
import { HTTP_STATUS } from "@/enums/enums";
import { sendEmail } from "@/helpers/Email";
import User from "@/models/users.model";
import { Error } from "@/types/ErrorTypes";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password, city, state, role, vehicleType, vehicleNumber } = reqBody;

        console.log(reqBody);

        // Check if user already exists
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (city.length === 0 || city === "select city") {
            return NextResponse.json({ error: "Please provide a valid city", success: false }, { status: HTTP_STATUS.BAD_REQUEST });
        }
        if (state.length === 0 || state === "Select State") {
            return NextResponse.json({ error: "Please provide a valid state", success: false }, { status: HTTP_STATUS.BAD_REQUEST });
        }
        if (!["user", "driver"].includes(role)) {
            return NextResponse.json({ error: "Invalid role", success: false }, { status: HTTP_STATUS.BAD_REQUEST });
        }
        if (user) {
            return NextResponse.json({ error: "User already exists", success: false }, { status: HTTP_STATUS.BAD_REQUEST });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Prepare user data
        const newUserData = {
            username,
            email,
            state,
            city,
            password: hashedPassword,
            role,
            driverDetails: role === "driver" ? { vehicleType, vehicleNumber } : null, // Include driver details
        };

        // Save user
        const newUser = new User(newUserData);
        const savedUser = await newUser.save();
        console.log(savedUser);

        // Send verification email
        await sendEmail({
            email,
            emailType: "VERIFY_USER",
            userId: savedUser._id,
        });

        return NextResponse.json(
            {
                message: "Email sent. Please verify your registration.",
                success: true,
            },
            {
                status: HTTP_STATUS.CREATED,
            },
        );
    } catch (error: unknown) {
        const Error = error as Error;
        return NextResponse.json({ error: Error.message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
    }
}
