import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Sample data based on the existing sampleVideos structure
const sampleBulletins = [
  {
    title:
      'Zaman Damgalı Özet (Türkçe) - "Çin ABD Bankalarını Vurdu, Finansal Kriz Riski Doğdu!"',
    summary:
      "Altın 4.320–4.380 USD aralığında yön ararken 4.500 hedefi korunuyor. Çin’in ABD bankalarına ve ekonomisine yönelik stratejik hamlesi küresel finans sisteminde yeni bir kriz riskini tetikliyor. Bölgesel banka sorunları yeniden gündemde; yatırımcılar için artık 'trading' dönemi başladı.",
    channelId: "Artunç Kocabalkan",
    videoUrl: "https://www.youtube.com/watch?v=MJC1qn00hr0",
    publishDate: new Date("2025-10-19"),
    tags: [
      "altın",
      "gümüş",
      "Çin",
      "ABD bankaları",
      "finansal kriz",
      "Nasdaq",
      "Bitcoin",
      "trading",
      "borsa",
      "fear & greed",
      "BS Ekonomi",
    ],
    duration: "28:36",
    thumbnail: "https://img.youtube.com/vi/MJC1qn00hr0/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:00",
        text: "Açılış: Günaydın, genç kalanlar selamı.",
        videoUrl: "https://www.youtube.com/watch?v=MJC1qn00hr0&t=0s",
      },
      {
        time: "02:12",
        text: "Altın 4200 gördü, hedef 4500; 4320–4380 aralığı kritik.",
        videoUrl: "https://www.youtube.com/watch?v=MJC1qn00hr0&t=132s",
      },
      {
        time: "04:09",
        text: "Çin ABD borsalarını vurdu; finansal kriz riski doğdu.",
        videoUrl: "https://www.youtube.com/watch?v=MJC1qn00hr0&t=249s",
      },
      {
        time: "07:44",
        text: "Nasdaq rekor sonrası satışta; dikkat çağrısı.",
        videoUrl: "https://www.youtube.com/watch?v=MJC1qn00hr0&t=464s",
      },
      {
        time: "10:37",
        text: "Bitcoin 107k; 102k destek, 114k hedef.",
        videoUrl: "https://www.youtube.com/watch?v=MJC1qn00hr0&t=637s",
      },
      {
        time: "17:55",
        text: "Çin’in ABD’ye ekonomik saldırısı: tarım ve dolar bağımlılığı.",
        videoUrl: "https://www.youtube.com/watch?v=MJC1qn00hr0&t=1075s",
      },
      {
        time: "19:02",
        text: "Altın trendi bitmiş olabilir; trading dönemi uyarısı.",
        videoUrl: "https://www.youtube.com/watch?v=MJC1qn00hr0&t=1142s",
      },
      {
        time: "20:44",
        text: "Fear & Greed endeksi aşırı korkuda; kriz alarmı.",
        videoUrl: "https://www.youtube.com/watch?v=MJC1qn00hr0&t=1244s",
      },
      {
        time: "23:01",
        text: "Türkiye'de borç ödeme ahlakı çöküyor.",
        videoUrl: "https://www.youtube.com/watch?v=MJC1qn00hr0&t=1381s",
      },
      {
        time: "26:35",
        text: "Trend değişebilir; 'son binen olmayın' uyarısı.",
        videoUrl: "https://www.youtube.com/watch?v=MJC1qn00hr0&t=1595s",
      },
    ],
  },
];

export async function POST() {
  try {
    await connectMongo();

    const results = [];

    for (const bulletin of sampleBulletins) {
      try {
        const result = await Bulletin.findOneAndUpdate(
          {
            title: bulletin.title,
            channelId: bulletin.channelId,
          },
          bulletin,
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
        results.push({
          title: bulletin.title,
          channel: bulletin.channelId,
          status: "upserted",
          _id: result._id,
        });
      } catch (videoError) {
        console.error(
          `Error processing bulletin ${bulletin.title}:`,
          videoError
        );
        results.push({
          title: bulletin.title,
          channel: bulletin.channelId,
          status: "failed",
          error: videoError.message,
        });
      }
    }

    return Response.json({
      success: true,
      message: `Successfully processed ${results.length} bulletins`,
      added: results.filter((r) => r.status === "upserted").length,
      total: results.length,
      results: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error seeding bulletins:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to seed bulletins",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
