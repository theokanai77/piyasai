import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

export async function GET() {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Fetch all bulletins with timestamps array preserved
    const bulletins = await Bulletin.find({ isActive: true })
      .sort({ publishDate: -1 })
      .select(
        "title summary timestamps channelId videoUrl publishDate tags duration thumbnail"
      )
      .lean();

    // Return success response with bulletins data
    return Response.json({
      success: true,
      data: bulletins,
      count: bulletins.length,
    });
  } catch (error) {
    console.error("Error fetching all bulletins:", error);

    // Return error response with detailed error information
    return Response.json(
      {
        success: false,
        error: "Failed to fetch bulletins",
        message: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
