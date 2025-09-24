import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

export async function GET() {
  try {
    console.log("Testing database connection...");

    // Test database connection
    await connectMongo();
    console.log("✅ Database connected successfully");

    // Test Bulletin model
    console.log("Testing Bulletin model...");
    const bulletinCount = await Bulletin.countDocuments();
    console.log(`✅ Bulletin model working. Found ${bulletinCount} documents`);

    // Test creating a simple bulletin
    console.log("Testing bulletin creation...");
    const testBulletin = {
      title: "Test Bulletin",
      summary: "Test summary",
      timestamps: [
        {
          time: "00:01",
          text: "Test timestamp",
          videoUrl: "https://youtube.com/watch?v=test",
        },
      ],
      channelId: "Test Channel",
      videoUrl: "https://youtube.com/watch?v=test",
      publishDate: new Date(),
      isActive: true,
    };

    const result = await Bulletin.findOneAndUpdate(
      { title: "Test Bulletin" },
      testBulletin,
      { upsert: true, new: true }
    );

    console.log("✅ Test bulletin created/updated:", result._id);

    return Response.json({
      success: true,
      message: "Database and Bulletin model test successful",
      database: "Connected",
      bulletinCount,
      testBulletinId: result._id,
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
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

