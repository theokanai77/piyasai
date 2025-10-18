#!/usr/bin/env node

/**
 * Backfill script to add isAdmin: false to existing users
 * This script ensures all existing users have the isAdmin field set to false
 * Run this script once after adding the isAdmin field to the User model
 */

import mongoose from "mongoose";
import User from "../models/User.js";

// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const connectMongo = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Add the MONGODB_URI environment variable inside .env.local to use mongoose"
    );
  }
  return mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((e) => console.error("Mongoose Client Error: " + e.message));
};

async function backfillIsAdmin() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectMongo();
    console.log("✅ Connected to MongoDB");

    // Find all users that don't have the isAdmin field or have it as undefined
    const usersToUpdate = await User.find({
      $or: [
        { isAdmin: { $exists: false } },
        { isAdmin: null },
        { isAdmin: undefined },
      ],
    });

    console.log(`📊 Found ${usersToUpdate.length} users to update`);

    if (usersToUpdate.length === 0) {
      console.log("✅ All users already have isAdmin field set");
      return;
    }

    // Update all users to set isAdmin: false
    const result = await User.updateMany(
      {
        $or: [
          { isAdmin: { $exists: false } },
          { isAdmin: null },
          { isAdmin: undefined },
        ],
      },
      { $set: { isAdmin: false } }
    );

    console.log(
      `✅ Successfully updated ${result.modifiedCount} users with isAdmin: false`
    );

    // Verify the update
    const updatedUsers = await User.find({ isAdmin: false });
    console.log(
      `🔍 Verification: ${updatedUsers.length} users now have isAdmin: false`
    );

    // Show sample of updated users
    if (updatedUsers.length > 0) {
      console.log("\n📋 Sample of updated users:");
      updatedUsers.slice(0, 5).forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} - isAdmin: ${user.isAdmin}`);
      });
    }
  } catch (error) {
    console.error("❌ Error during backfill:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the backfill
backfillIsAdmin();
