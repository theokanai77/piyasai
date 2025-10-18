import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

// POST - Backfill isAdmin field for existing users
export async function POST() {
  try {
    await connectMongo();

    // Find all users that don't have the isAdmin field
    const usersToUpdate = await User.find({
      isAdmin: { $exists: false },
    });

    if (usersToUpdate.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All users already have isAdmin field set",
        updatedCount: 0,
      });
    }

    // Update all users to set isAdmin: false
    const result = await User.updateMany(
      { isAdmin: { $exists: false } },
      { $set: { isAdmin: false } }
    );

    // Verify the update
    const updatedUsers = await User.find({ isAdmin: false });

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} users with isAdmin: false`,
      updatedCount: result.modifiedCount,
      totalUsersWithIsAdmin: updatedUsers.length,
      sampleUsers: updatedUsers.slice(0, 5).map((user) => ({
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      })),
    });
  } catch (error) {
    console.error("❌ Error during backfill:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to backfill isAdmin field",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET - Check current status of isAdmin field
export async function GET() {
  try {
    await connectMongo();

    const totalUsers = await User.countDocuments();
    const usersWithIsAdmin = await User.countDocuments({
      isAdmin: { $exists: true },
    });
    const usersWithoutIsAdmin = await User.countDocuments({
      isAdmin: { $exists: false },
    });
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const nonAdminUsers = await User.countDocuments({ isAdmin: false });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        usersWithIsAdmin,
        usersWithoutIsAdmin,
        adminUsers,
        nonAdminUsers,
      },
      needsBackfill: usersWithoutIsAdmin > 0,
    });
  } catch (error) {
    console.error("❌ Error checking isAdmin status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check isAdmin status",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
