import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Sample data based on the existing sampleVideos structure
const sampleBulletins = [
  {
    title:
      'Zaman Damgalı Özet (Türkçe) - "Altın Ons 3333 USD den Gram 5333 TL’ye, Enflasyon Rüzgarı %3,17 ve Altın Eylül Getirisi %10,17"',
    summary:
      "Eylülde altın TL’de %10,17, gümüş %16,20 getiri sağladı. Konuşmacı, İTO %3,17 verisi ve kur riskleri eşliğinde kredili fiziki alım, yatayda birikim ve düşüşte agresif alım stratejisini savunuyor; UBS 2026 ortası 4200$ ons tahminini referans veriyor.",
    channelId: "Cihat E. Çiçek",
    videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU",
    publishDate: new Date("2025-10-02"),
    tags: [
      "altın",
      "gram altın",
      "gümüş",
      "İTO enflasyonu",
      "kredi kartı taksit",
      "kaldıraç",
      "UBS 4200$",
      "dolar/TL",
      "merkez bankaları",
      "AI balonu",
    ],
    duration: "39:34",
    thumbnail: "https://img.youtube.com/vi/Ekbg-QVwvzU/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:01",
        text: "Ekim 2; dolar/TL 42–42,5 bandı beklentisi.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=1s",
      },
      {
        time: "00:32",
        text: "Eylülde altın TL’de %10,17 getirdi; 3333$ referansından güçlü yukarı hareket.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=32s",
      },
      {
        time: "01:40",
        text: "İTO enflasyonu %3,17; kredili fiziki altın/bilezik alım mantığı.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=100s",
      },
      {
        time: "03:02",
        text: "Holdingler gibi ‘başkasının parası’nı kullan; kart faizi ile getiriyi kıyasla.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=182s",
      },
      {
        time: "04:21",
        text: "Kur kontrolü kalıcı olamaz; patlama riski her an var.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=261s",
      },
      {
        time: "05:20",
        text: "Gün içi fon akışı takibiyle dipten alım taktiği.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=320s",
      },
      {
        time: "06:07",
        text: "Taksitle fiziki altın/bilezik: N11, Hepsiburada, Amazon örnekleri; 25 yıllık tecrübe.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=367s",
      },
      {
        time: "09:20",
        text: "Gram 5333 TL ‘kapıda’; ons ~3869$ ile yatay gidiş sağlıklı.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=560s",
      },
      {
        time: "10:13",
        text: "UBS: 2026 ortası 4200$ ons tahmini (yıllık ~%7–8 dolar bazında).",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=613s",
      },
      {
        time: "12:09",
        text: "Kredi kısıtları → haneler gıdaya yükleniyor; gıda enflasyonu kontrol dışı.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=729s",
      },
      {
        time: "15:44",
        text: "Merkez bankaları fiziki altın istifliyor; bireye kısıtlar varken kamuda biriktirme.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=944s",
      },
      {
        time: "17:31",
        text: "Rezerv kompozisyonu: dolar sistemi risklerine karşı altın güvence.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=1051s",
      },
      {
        time: "24:23",
        text: "“Gerçek enflasyon altın karşısındaki enflasyondur”; arz artışı ~%2/yıl.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=1463s",
      },
      {
        time: "26:03",
        text: "Yapay zekâ hisselerinde CAPEX/kar dengesizliği; balon uyarısı.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=1563s",
      },
      {
        time: "28:57",
        text: "ABD federal kapanma → veri yokluğu; para politikasında belirsizlik.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=1737s",
      },
      {
        time: "33:19",
        text: "Gümüş Eylül getirisi ~%16,20 (TL); altın+gümüş birlikte taşınır.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=1999s",
      },
      {
        time: "34:36",
        text: "Kredili emlak kaldıraç örneği: enflasyon ortamında üstün getiri.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=2076s",
      },
      {
        time: "39:13",
        text: "Strateji: yatayda birikim, düşüşte agresif alım; kurdan ek getiri hedefi.",
        videoUrl: "https://www.youtube.com/watch?v=Ekbg-QVwvzU&t=2353s",
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
