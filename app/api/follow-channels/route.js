import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// GET method - Retrieve user's followed channels
export async function GET(request) {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user and return followed channels
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { followedChannels: user.followedChannels || [] },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("❌ GET /api/follow-channels error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST method - Toggle channel follow status
export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { channelName } = await request.json();

    // Validate channelName
    if (!channelName || typeof channelName !== "string") {
      return NextResponse.json(
        { error: "Channel name is required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Toggle follow status
    if (user.followedChannels.includes(channelName)) {
      // Unfollow: remove from array
      user.followedChannels = user.followedChannels.filter(
        (c) => c !== channelName
      );
    } else {
      // Follow: add to array
      user.followedChannels.push(channelName);
    }

    // Save user
    await user.save();

    return NextResponse.json(
      { followedChannels: user.followedChannels },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("❌ POST /api/follow-channels error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
