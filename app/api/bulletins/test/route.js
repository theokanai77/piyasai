import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

export async function GET() {
  try {
    // Test database connection
    console.log("Testing database connection...");
    await connectMongo();
    console.log("✅ Database connection successful");

    // Test Bulletin model
    console.log("Testing Bulletin model...");
    const bulletinCount = await Bulletin.countDocuments();
    console.log(`✅ Bulletin model working. Found ${bulletinCount} documents`);

    // Test fetching with timestamps
    console.log("Testing timestamps preservation...");
    const sampleBulletin = await Bulletin.findOne({ isActive: true }).lean();

    if (sampleBulletin) {
      console.log(`✅ Sample bulletin found: "${sampleBulletin.title}"`);
      console.log(
        `✅ Timestamps array preserved: ${
          sampleBulletin.timestamps?.length || 0
        } timestamps`
      );
    } else {
      console.log("⚠️ No bulletins found in database");
    }

    return Response.json({
      success: true,
      message: "Database and Bulletin model test successful",
      database: "Connected",
      bulletinCount,
      sampleBulletin: sampleBulletin
        ? {
            title: sampleBulletin.title,
            channelId: sampleBulletin.channelId,
            timestampsCount: sampleBulletin.timestamps?.length || 0,
            hasTimestamps: Array.isArray(sampleBulletin.timestamps),
          }
        : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Test failed:", error);

    return Response.json(
      {
        success: false,
        message: "Database or Bulletin model test failed",
        error: error.message,
        errorType: error.name,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
