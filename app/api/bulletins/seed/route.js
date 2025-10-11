import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Sample data based on the existing sampleVideos structure
const sampleBulletins = [
  {
    title:
      'Zaman Damgalı Özet (Türkçe) - "Düşüş mü, Yükseliş mi? | Neler Oluyor?"',
    summary:
      "Ekonomist, altın, gümüş, Bitcoin, dolar ve borsa piyasalarını analiz ediyor. Altın ve gümüşte kısa vadeli düşüş, Bitcoin’de yıl sonuna kadar yükseliş öngörüyor. Borsa için pozitif, dolar için nötr bir görünüm çiziyor.",
    channelId: "YouTube Yayını",
    videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
    publishDate: new Date("2025-10-11"),
    tags: [
      "altın",
      "gümüş",
      "bitcoin",
      "borsa",
      "dolar",
      "euro",
      "faiz",
      "merkez bankası",
      "jeopolitik risk",
      "yatırım analizi",
    ],
    duration: "12:02",
    thumbnail: "https://img.youtube.com/vi/NYSLiYDCubM/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:43",
        text: "Altın ve gümüş haftayı rekor denemeleriyle kapattı; 4.000 dolar ons seviyesi kritik.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "01:27",
        text: "Jeopolitik gerilimler, Fed’in faiz politikası, ABD hükümet kapanması gibi faktörler yükselişi destekliyor.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "01:47",
        text: "Analist, kendi pozisyonunda short açtığını ve Bitcoin’e geçtiğini açıklıyor.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "02:06",
        text: "4.057 dolar seviyesine kadar çıkan ons altında 100 dolarlık kar satışı görüldü.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "02:34",
        text: "2026 hedefleri: ons altın 4.250 dolar, gram altın 6.500 TL.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "03:06",
        text: "Teknik destekler: 3.900 – 3.710 dolar; kısa vadede düzeltme bekleniyor.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "03:35",
        text: "Bitcoin pozisyonu yıl sonuna kadar korunacak; fiyat hedefi 135.000 dolar.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "04:21",
        text: "Sosyal medyadaki 'altın roket' algısı manipülasyon olarak değerlendiriliyor.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "04:45",
        text: "Gümüş 51 dolar seviyesini test etti; analist bu yükselişi 'coşku' olarak görüyor.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "05:55",
        text: "Gümüş gram fiyatı 67,93 TL; manipülatif ve şişik. Düşüş riski altına göre daha yüksek.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "06:17",
        text: "Altın/gümüş rasyosu 79,49; sabırlı yatırımcıların kazandığı bir dönem.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "07:04",
        text: "Kısa vadede nakit ihtiyacı olanlar için satış fırsatı; düşüş yönlü öngörü korunuyor.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "07:27",
        text: "Brent petrol 64 dolar; 65 dolar altı 'alım fırsatı' olarak görülüyor.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "07:49",
        text: "Bitcoin 121.775 dolar; ana trend yukarı, yıl sonuna kadar pozitif görünüm.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "08:33",
        text: "Euro dolar karşısında ucuz; paritede 1.1580 hedefi korunuyor.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "09:35",
        text: "Dolar endeksi 99; 100 üzerine çıkarsa paritede düşüş olabilir.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "09:57",
        text: "Dolar/TL 41,82; yıl sonu hedefi 43,80 – 45 aralığında.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "10:19",
        text: "Borsa İstanbul 10.746; ucuz ve 11.800 hedefi korunuyor.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "10:39",
        text: "Merkez Bankası rezervleri 186 milyar dolar üstüne çıktı, borsayı destekleyebilir.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
      },
      {
        time: "11:00",
        text: "Belirsizlik hâkim; herkesin ekonomist olduğu bir dönemde sistem yine kazanıyor.",
        videoUrl: "https://www.youtube.com/watch?v=NYSLiYDCubM",
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
