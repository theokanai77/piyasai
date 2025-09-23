import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

export async function GET() {
  try {
    // Connect to database
    await connectMongo();

    // Test basic aggregation
    console.log("Testing channels aggregation...");

    const testAggregation = await Bulletin.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$channelId",
          videoCount: { $sum: 1 },
          lastPublishDate: { $max: "$publishDate" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          videoCount: 1,
          lastPublishDate: 1,
        },
      },
      { $sort: { videoCount: -1 } },
    ]);

    console.log(`✅ Found ${testAggregation.length} unique channels`);

    // Test avatar color mapping
    const getAvatarColor = (channelName) => {
      const colorMap = {
        "Çiğdem Çiçek": "blue",
        "İslam Memiş": "green",
        "Elit Finans": "purple",
        "Devrim Akyıl": "orange",
      };
      return colorMap[channelName] || "gray";
    };

    // Format test data
    const formattedChannels = testAggregation.map((channel) => ({
      name: channel.name,
      avatarColor: getAvatarColor(channel.name),
      videoCount: channel.videoCount,
      isActive: true,
    }));

    console.log("✅ Channels formatted successfully");
    console.log("Sample channels:", formattedChannels.slice(0, 2));

    return Response.json({
      success: true,
      message: "Channels API test successful",
      testResults: {
        totalChannels: testAggregation.length,
        sampleChannels: formattedChannels.slice(0, 3),
        aggregationWorking: true,
        colorMappingWorking: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Channels API test failed:", error);

    return Response.json(
      {
        success: false,
        message: "Channels API test failed",
        error: error.message,
        errorType: error.name,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
