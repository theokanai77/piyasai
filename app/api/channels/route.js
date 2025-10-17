import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

export const dynamic = "force-dynamic";

// Map channel names to avatar colors
const getAvatarColor = (channelName) => {
  const colorMap = {
    "Çiğdem Çiçek": "blue",
    "İslam Memiş": "green",
    "Elit Finans": "purple",
    "Devrim Akyıl": "orange",
    // Add more channel mappings as needed
  };

  // Default color assignment based on name hash if not in map
  if (colorMap[channelName]) {
    return colorMap[channelName];
  }

  // Fallback: assign colors based on name hash
  const colors = [
    "blue",
    "green",
    "purple",
    "orange",
    "red",
    "yellow",
    "pink",
    "indigo",
  ];
  const hash = channelName.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};

export async function GET() {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Use MongoDB aggregation to get unique channels with video counts
    const channels = await Bulletin.aggregate([
      // Match only active bulletins
      { $match: { isActive: true } },

      // Group by channelId and count videos
      {
        $group: {
          _id: "$channelId",
          videoCount: { $sum: 1 },
          // Get the most recent publish date for sorting
          lastPublishDate: { $max: "$publishDate" },
        },
      },

      // Project to match desired format
      {
        $project: {
          _id: 0,
          name: "$_id",
          videoCount: 1,
          lastPublishDate: 1,
          // Add avatarColor based on channel name
          avatarColor: { $literal: "placeholder" }, // Will be set in map function
        },
      },

      // Sort by video count (descending) then by last publish date
      {
        $sort: {
          videoCount: -1,
          lastPublishDate: -1,
        },
      },
    ]);

    // Transform the results to match sampleChannels format
    const formattedChannels = channels.map((channel) => ({
      name: channel.name,
      avatarColor: getAvatarColor(channel.name),
      videoCount: channel.videoCount,
      isActive: true, // All channels from active bulletins are considered active
    }));

    return Response.json({
      success: true,
      message: "Channels fetched successfully",
      data: formattedChannels,
      count: formattedChannels.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching channels:", error);

    // Detailed error logging
    if (error.name === "MongoServerError") {
      console.error("MongoDB Server Error:", error.message);
    } else if (error.name === "MongooseError") {
      console.error("Mongoose Error:", error.message);
    }

    // Return error response
    const errorResponse = {
      success: false,
      error: "Failed to fetch channels",
      message: error.message,
      timestamp: new Date().toISOString(),
    };

    // Add additional error details in development mode
    if (process.env.NODE_ENV === "development") {
      errorResponse.stack = error.stack;
      errorResponse.errorType = error.name;
    }

    return Response.json(errorResponse, { status: 500 });
  }
}
