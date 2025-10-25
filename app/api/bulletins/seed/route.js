import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Sample data based on the existing sampleVideos structure
const sampleBulletins = [
  {
    title: 'Zaman Damgalı Özet (Türkçe) - "BÜYÜK ŞOKA HAZIR OLUN"',
    summary:
      "Altın 4.000$ sınırında düzeltme yaşarken anlatıcı bunun trend kırılması değil, büyük yükseliş öncesi fırtına sessizliği olduğunu söylüyor. Jeopolitik gerilim, olası 3. Dünya Savaşı ve Türkiye’deki ekonomik baskılarla birlikte hem küresel hem yerel ölçekte 'şok' uyarısı yapılıyor.",
    channelId: "Selçuk Geçer",
    videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c",
    publishDate: new Date("2025-10-23"),
    tags: [
      "altın",
      "dünya savaşı",
      "Trump",
      "Putin",
      "Şi Cinping",
      "kur şoku",
      "reel sektör",
      "vergi",
      "Mehmet Şimşek",
      "faiz",
      "yatırım",
      "ekonomi",
    ],
    duration: "15:02",
    thumbnail: "https://img.youtube.com/vi/s-vpKZNfX9c/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:00",
        text: "Altın 4.000$ sınırında; 3950–3900$ olasılığı ama trend bozulmadı.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=0s",
      },
      {
        time: "00:36",
        text: "Trump–Putin–Şi gerilimi: 3. Dünya Savaşı iması.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=36s",
      },
      {
        time: "01:03",
        text: "%6,5 düşüş: 12 yılın en sert düzeltmesi, ama trend devam.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=63s",
      },
      {
        time: "01:26",
        text: "Reel sektör krediye ulaşamıyor; kur şoku mu geliyor?",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=86s",
      },
      {
        time: "02:19",
        text: "Her 100 TL verginin 62 TL’sini vatandaş ödüyor.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=139s",
      },
      {
        time: "03:05",
        text: "Gıda krizine dikkat: 'Ucuz et için Yunanistan’a turlar.'",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=185s",
      },
      {
        time: "04:20",
        text: "Putin ve Şi masayı çevirdi, Trump yalnızlaştı.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=260s",
      },
      {
        time: "05:58",
        text: "Silahlanma yarışı: 3. Dünya Savaşı olasılığı artıyor.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=358s",
      },
      {
        time: "06:46",
        text: "Altın 6.000$ hedefi; savaş riski fiyatlanıyor.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=406s",
      },
      {
        time: "07:32",
        text: "Vatandaş refahı eriyor; vergi yükü ağırlaşıyor.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=452s",
      },
      {
        time: "09:33",
        text: "Reel sektörün döviz borcu 354.8 milyar $, kur şoku kapıda.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=573s",
      },
      {
        time: "11:34",
        text: "İş dünyasından eleştiriler: 'Faiz indirimi işe yaramıyor.'",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=694s",
      },
      {
        time: "13:06",
        text: "Faiz kazancı yatırımın önüne geçti.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=786s",
      },
      {
        time: "13:55",
        text: "Reform şart: Planlı karma ekonomi olmadan çıkış yok.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=835s",
      },
      {
        time: "14:43",
        text: "Son uyarı: Vatandaş battı, sırada reel sektör var.",
        videoUrl: "https://www.youtube.com/watch?v=s-vpKZNfX9c&t=883s",
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
