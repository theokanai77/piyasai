import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Sample data based on the existing sampleVideos structure
const sampleBulletins = [
  {
    title:
      'Zaman Damgalı Özet (Türkçe) - "Son canlı yayınımızın (08/09/2025) podcast özeti"',
    summary:
      "Elit Finans’ın 8 Eylül 2025 canlı yayın analizinde; altın, dolar, borsa ve kripto üzerine ana akımın tersine tahminler paylaşılıyor. Altında 8000 $ hedefi, doların ani sıçrama potansiyeli, Bitcoin’de 'yıkım' uyarısı ve teknik analiz merkezli farklı bir piyasa felsefesi öne çıkıyor.",
    channelId: "Elit Finans",
    videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
    publishDate: new Date("2025-09-08"),
    tags: [
      "altın",
      "dolar",
      "borsa",
      "kripto",
      "teknik analiz",
      "Elit Finans",
      "yatırım stratejisi",
    ],
    duration: "15:53",
    thumbnail: "https://img.youtube.com/vi/1AuuvMcN9mY/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:00",
        text: "Analizin amacı: teknik göstergelerle ana akımın tersine öngörüler.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "00:39",
        text: "Çoğunluk kaybeder, azınlık kazanır prensibi.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "01:59",
        text: "Teknik analiz: haberlerden önce sinyal verir.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "03:09",
        text: "Altında %10 yükseliş sonrası 3700 kritik eşik.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "04:10",
        text: "3800–8000 $ uzun vadeli hedefler.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "04:40",
        text: "Fiziki altın kıtlığı ve kağıt altın baskısı iddiası.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "05:26",
        text: "1 gr fiziksele karşılık 137 gr kağıt altın.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "06:14",
        text: "Balinalar ve elit aileler fiziki altın topluyor.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "07:00",
        text: "Yıl sonu gram altın hedefi: 5400 ₺.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "07:24",
        text: "Dolar adil değer: 42–50 ₺; ani sıçrama riski.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "08:47",
        text: "Borsa İstanbul’da tehlike: 236 $ altı riskli.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "09:42",
        text: "ABD–DAX endeksleri için düşüş senaryosu.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "11:02",
        text: "Bitcoin 112.000 $ üzerinde kalırsa 'yıkım' uyarısı.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "13:06",
        text: "Gümüş 40 $ üzerinde pozitif. Platin: 1258–1260 $ alım fırsatı.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "13:34",
        text: "Konut: şimdilik uzak dur, altın & dolar sonrası fırsat.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "14:32",
        text: "Analiz: fiyat tahminlerinin ötesinde küresel güç oyunları yorumu.",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
      },
      {
        time: "15:20",
        text: "Soru: Gerçek değer algısı ne kadar sağlam?",
        videoUrl: "https://www.youtube.com/watch?v=1AuuvMcN9mY",
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
