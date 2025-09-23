import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Enhanced avatar color mapping with more channels
const getAvatarColor = (channelName) => {
  const colorMap = {
    // Financial experts
    "Çiğdem Çiçek": "blue",
    "İslam Memiş": "green",
    "Elit Finans": "purple",
    "Devrim Akyıl": "orange",

    // Additional channels (if they exist in the future)
    "Finansal Analiz": "red",
    "Yatırım Uzmanı": "yellow",
    "Piyasa Takip": "pink",
    "Ekonomi Haber": "indigo",
    "Borsa Analizi": "teal",
    "Kripto Uzman": "cyan",
  };

  // Return mapped color or generate from hash
  if (colorMap[channelName]) {
    return colorMap[channelName];
  }

  // Fallback: consistent color assignment based on name hash
  const colors = [
    "blue",
    "green",
    "purple",
    "orange",
    "red",
    "yellow",
    "pink",
    "indigo",
    "teal",
    "cyan",
  ];
  const hash = channelName.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};

export async function GET(request) {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const minVideoCount = parseInt(searchParams.get("minVideoCount")) || 0;

    // Build aggregation pipeline
    const pipeline = [
      // Match bulletins based on criteria
      {
        $match: {
          ...(includeInactive ? {} : { isActive: true }),
          // Additional filters can be added here
        },
      },

      // Group by channelId and aggregate data
      {
        $group: {
          _id: "$channelId",
          videoCount: { $sum: 1 },
          lastPublishDate: { $max: "$publishDate" },
          firstPublishDate: { $min: "$publishDate" },
          // Get sample titles for each channel
          sampleTitles: { $push: "$title" },
          // Count unique video URLs
          uniqueVideoUrls: { $addToSet: "$videoUrl" },
        },
      },

      // Filter by minimum video count
      {
        $match: {
          videoCount: { $gte: minVideoCount },
        },
      },

      // Project to desired format
      {
        $project: {
          _id: 0,
          name: "$_id",
          videoCount: 1,
          lastPublishDate: 1,
          firstPublishDate: 1,
          // Get first few characters of sample titles
          sampleTitles: { $slice: ["$sampleTitles", 3] },
          uniqueVideoCount: { $size: "$uniqueVideoUrls" },
          // Calculate activity status based on recent publishing
          isRecentlyActive: {
            $gte: [
              "$lastPublishDate",
              { $subtract: [new Date(), 7 * 24 * 60 * 60 * 1000] }, // 7 days ago
            ],
          },
        },
      },

      // Sort by video count (descending) then by last publish date
      {
        $sort: {
          videoCount: -1,
          lastPublishDate: -1,
        },
      },
    ];

    // Execute aggregation
    const channels = await Bulletin.aggregate(pipeline);

    // Transform results to match sampleChannels format
    const formattedChannels = channels.map((channel) => ({
      name: channel.name,
      avatarColor: getAvatarColor(channel.name),
      videoCount: channel.videoCount,
      isActive: channel.isRecentlyActive,
      // Additional metadata (optional)
      lastPublishDate: channel.lastPublishDate,
      uniqueVideoCount: channel.uniqueVideoCount,
      sampleTitles: channel.sampleTitles,
    }));

    // Calculate summary statistics
    const totalChannels = formattedChannels.length;
    const totalVideos = formattedChannels.reduce(
      (sum, channel) => sum + channel.videoCount,
      0
    );
    const activeChannels = formattedChannels.filter(
      (channel) => channel.isActive
    ).length;

    return Response.json({
      success: true,
      message: "Channels fetched successfully",
      data: formattedChannels,
      summary: {
        totalChannels,
        totalVideos,
        activeChannels,
        inactiveChannels: totalChannels - activeChannels,
      },
      filters: {
        includeInactive,
        minVideoCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching channels:", error);

    // Detailed error logging
    if (error.name === "MongoServerError") {
      console.error("MongoDB Server Error:", error.message);
    } else if (error.name === "MongooseError") {
      console.error("Mongoose Error:", error.message);
    } else if (error.name === "CastError") {
      console.error("Cast Error (invalid parameter):", error.message);
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
