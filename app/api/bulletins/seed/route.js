import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Sample data based on the existing sampleVideos structure
const sampleBulletins = [
  {
    title:
      'Zaman Damgalı Özet (Türkçe) - "Altın Çıkıyor! Gümüş & Platin Yanıyor!🧿"',
    summary:
      "Altın, gümüş ve platinde ralliler ivmeleniyor. Analist, 2025’in son çeyreğinde dramatik senaryolarla birlikte yeni rekorların mümkün olduğunu, ETF ve fiziki sıkışıklıkların gümüşte short squeeze riskini artırdığını, platin ve paladyumda ise güçlü teknik formasyonların yukarı işaret ettiğini vurguluyor.",
    channelId: "YouTube Yayını",
    videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
    publishDate: new Date("2025-09-28"),
    tags: [
      "Altın",
      "Gümüş",
      "Platin",
      "Paladyum",
      "Elliott Dalga",
      "ETF",
      "Short Squeeze",
      "Para Arzı",
      "Çin Rezervleri",
      "MTA",
    ],
    duration: "22:04",
    thumbnail: "https://img.youtube.com/vi/Qtse8rpkvbU/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:00",
        text: "Altın, gümüş ve platin rallisi sürüyor; yatırımcılar trendden faydalanıyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "00:52",
        text: "Satışın kişisel karar olduğu, zirvenin henüz yakın olmadığı belirtiliyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "01:14",
        text: "Altın 3. Elliott dalgasında; en büyük kazançların bu aşamada geleceği vurgulanıyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "01:38",
        text: "Hedefe ulaşan yatırımcılar için kısmi satış uygun ama trend genel olarak yukarı.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "02:40",
        text: "2025 son çeyrek–2026 için dramatik senaryolara hazırlık gerektiği söyleniyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "03:02",
        text: "Gümüş 45–50$ bandına dayandı; 1980 zirvesine göre daha yolu var.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "04:37",
        text: "Para arzı–altın ilişkisi: Altın fiyatı, global money supply ile denge arıyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "05:04",
        text: "JP Morgan’ın manipülasyonları ve devlet desteğiyle baskı iddiası.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "05:39",
        text: "Hindistan’ın gümüş ithalatı rekor kırıyor; Londra’da fiziki sıkıntı öne çıkıyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "06:26",
        text: "ETF’lerin fiziki karşılık bulmakta zorlandığı, short squeeze riskinin arttığı anlatılıyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "07:13",
        text: "Ekonomistlerin düşük tahminleri yatırımcıyı yanılttı; faiz yanıltıcı bir enstrüman.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "08:24",
        text: "ABD faizleri yükselirken de altın–gümüşün yükselebileceği tekrar hatırlatılıyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "08:57",
        text: "Altında 4000–6000$ potansiyel; Morgan Stanley’nin portföy senaryosu örnek veriliyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "09:21",
        text: "Çin’in altın rezervleri artıyor; 2025 yılı olağanüstü bir yıl olarak tarihe geçebilir.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "10:28",
        text: "Altın–S&P ve Dow Jones oranları altının yukarı potansiyeline işaret ediyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "11:35",
        text: "Gümüşte 51$ kritik hedef; kırılırsa büyük patlama bekleniyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "14:05",
        text: "Altın–gümüş rasyosu düşüyor; metallerin birlikte hızlanacağı görüşü öne çıkıyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "15:54",
        text: "Platin 1507$ üzerinde yön yukarı; 1964$ ve 2400$ hedefleri korunuyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "17:32",
        text: "Paladyumda ters omuz–baş–omuz formasyonu; yükseliş trendi başlamış olabilir.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "18:31",
        text: "Buğday ve soya uzun vadeli fırsatlar; petrol ve doğalgazda kısa vadeli trade önerisi.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "20:07",
        text: "EUR/USD ve USD/JPY pariteleri kritik seviyelerde; dolar güçlenmesi risk yaratıyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
      },
      {
        time: "22:04",
        text: "Kaldıraçsız, sabırlı yatırımcı için ralliler normal; orta–uzun vadede daha fazlası bekleniyor.",
        videoUrl: "https://www.youtube.com/watch?v=Qtse8rpkvbU",
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
