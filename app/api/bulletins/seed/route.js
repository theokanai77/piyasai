import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Sample data based on the existing sampleVideos structure
const sampleBulletins = [
  {
    title:
      'Zaman Damgalı Özet (Türkçe) - "ALTIN \'DA KIYAMET SENARYOSU! | MURAT MURATOĞLU - REMZİ ÖZDEMİR"',
    summary:
      'Altın ve petrol fiyatlamasına jeopolitik mercek: MHP–AKP gerilimi ve olası seçim, THY–Boeing tartışması, BIST’te endeks mühendisliği iddiası ve BRICS/merkez bankalarının agresif altın alımları ışığında "dijital altın" söylemi öne çıkıyor.',
    channelId: "Murat Muratoğlu",
    videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
    publishDate: new Date("2025-09-24"),
    tags: [
      "altın",
      "Murat Muratoğlu",
      "Remzi Özdemir",
      "BRICS",
      "merkez bankaları",
      "MHP",
      "Devlet Bahçeli",
      "erken seçim",
      "THY Boeing",
      "BIST",
      "SPK",
      "Rus petrolü",
    ],
    duration: "59:50",
    thumbnail: "https://img.youtube.com/vi/ATmNypsEY9M/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:06",
        text: "Açılış: altın/petrol/siyaset çerçevesi ve yayın akışı",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "01:30",
        text: "Kıbrıs’ta yayın fikri; saha ve kulis notları",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "02:48",
        text: "Rus petrolü ~41$ iddiası; Brent ~65$ karşılaştırması",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "03:44",
        text: "ABD’nin OPEC+ üzerindeki baskısı ve fiyat dinamiği",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "06:38",
        text: "MHP–AKP hattında tansiyon; emniyette koltuk değişimleri",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "09:29",
        text: "Bahçeli’nin seçim çağrısı yapabileceği tezi",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "11:13",
        text: "İsrail–Türkiye ilişkileri: çıkar dengesi ve Gazze bağlamı",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "13:03",
        text: "Katar’a yönelik hava operasyonu iddiasının okuması",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "15:12",
        text: "THY–Boeing 300 uçak tartışması; borsadaki hızlı fiyatlama",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "18:21",
        text: "BIST’te sert satışlar; BoA/Tera etkisi iddiası",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "19:10",
        text: "Siyasi risk: Bahçeli’nin elindeki koz ve seçim ihtimali",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "23:34",
        text: "Bitcoin stratejisi (100k$ altı alım, staking notu)",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "25:20",
        text: "Borsa operasyonları: kara para aklama iddiaları",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "26:40",
        text: "“Para girişi yoksa endeks mühendisliği var” tezi",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "31:36",
        text: "Yakın dönemde kontrollü halka arzlar gelebilir",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "33:07",
        text: "MB kur stratejisi: enflasyonun bir tık üstü artış",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "38:25",
        text: "Alım gücü erozyonu; beklenen vs. açıklanan enflasyon",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "39:43",
        text: "Altın ithalat kısıtının maliyeti iddiası (~25 milyar$)",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "41:26",
        text: "Hindistan/Çin tahvil satıp altın alıyor; CB alımları",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "51:24",
        text: "Uzun vade: altın 5 yılda 9.000$ bandı iddiası",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
      },
      {
        time: "58:50",
        text: "Kapanış: vadeliler ve tahvil piyasasını izleme önerisi",
        videoUrl: "https://www.youtube.com/watch?v=ATmNypsEY9M",
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
