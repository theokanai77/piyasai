import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channelId");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    // Filter by channel if provided
    if (channelId && channelId !== "all") {
      query.channelId = channelId;
    }

    // Search functionality
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { summary: { $regex: search, $options: "i" } },
          { channelId: { $regex: search, $options: "i" } },
        ],
      };
    }

    const bulletins = await Bulletin.find(query)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Bulletin.countDocuments(query);

    return Response.json({
      success: true,
      data: bulletins,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bulletins:", error);
    return Response.json(
      { success: false, error: "Failed to fetch bulletins" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectMongo();

    const body = await request.json();
    const {
      title,
      summary,
      timestamps,
      channelId,
      videoUrl,
      publishDate,
      tags,
      duration,
      thumbnail,
    } = body;

    // Validate required fields
    if (
      !title ||
      !summary ||
      !timestamps ||
      !channelId ||
      !videoUrl ||
      !publishDate
    ) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate timestamps array
    if (!Array.isArray(timestamps) || timestamps.length === 0) {
      return Response.json(
        { success: false, error: "Timestamps must be a non-empty array" },
        { status: 400 }
      );
    }

    // Validate each timestamp
    for (const timestamp of timestamps) {
      if (!timestamp.time || !timestamp.text || !timestamp.videoUrl) {
        return Response.json(
          {
            success: false,
            error: "Each timestamp must have time, text, and videoUrl",
          },
          { status: 400 }
        );
      }
    }

    const bulletin = new Bulletin({
      title,
      summary,
      timestamps,
      channelId,
      videoUrl,
      publishDate: new Date(publishDate),
      tags: tags || [],
      duration,
      thumbnail,
    });

    await bulletin.save();

    return Response.json(
      {
        success: true,
        data: bulletin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bulletin:", error);

    if (error.name === "ValidationError") {
      return Response.json(
        { success: false, error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: "Failed to create bulletin" },
      { status: 500 }
    );
  }
}
