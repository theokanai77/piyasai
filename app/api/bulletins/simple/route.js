import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

export async function GET() {
  let dbConnection = null;

  try {
    // Establish database connection
    console.log("Connecting to MongoDB...");
    dbConnection = await connectMongo();

    if (!dbConnection) {
      throw new Error("Failed to establish database connection");
    }

    console.log("Database connected successfully");

    // Fetch all active bulletins with full timestamps array
    console.log("Fetching bulletins from database...");
    const bulletins = await Bulletin.find({ isActive: true })
      .sort({ publishDate: -1 })
      .lean(); // Use lean() for better performance

    console.log(`Successfully fetched ${bulletins.length} bulletins`);

    // Validate that timestamps are preserved
    const bulletinsWithTimestamps = bulletins.map((bulletin) => ({
      ...bulletin,
      timestamps: bulletin.timestamps || [], // Ensure timestamps array exists
      timestampCount: bulletin.timestamps ? bulletin.timestamps.length : 0,
    }));

    // Return successful response
    return Response.json({
      success: true,
      message: "Bulletins fetched successfully",
      data: bulletinsWithTimestamps,
      count: bulletinsWithTimestamps.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in GET /api/bulletins/simple:", error);

    // Detailed error logging
    if (error.name === "MongoServerError") {
      console.error("MongoDB Server Error:", error.message);
    } else if (error.name === "MongooseError") {
      console.error("Mongoose Error:", error.message);
    } else if (error.name === "ValidationError") {
      console.error("Validation Error:", error.message);
    }

    // Return appropriate error response
    const errorResponse = {
      success: false,
      error: "Failed to fetch bulletins",
      message: error.message,
      timestamp: new Date().toISOString(),
    };

    // Add additional error details in development mode
    if (process.env.NODE_ENV === "development") {
      errorResponse.stack = error.stack;
      errorResponse.errorType = error.name;
    }

    return Response.json(errorResponse, { status: 500 });
  } finally {
    // Cleanup database connection if needed
    if (dbConnection) {
      console.log("Database connection cleanup completed");
    }
  }
}
