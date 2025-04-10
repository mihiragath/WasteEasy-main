import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.model";
import { connect } from "@/database/db";

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get("user-id"); // Assume user ID is passed in headers
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user || user.role !== "driver") {
            return NextResponse.json({ error: "Driver not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
