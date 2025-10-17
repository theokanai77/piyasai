import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Sample data based on the existing sampleVideos structure
const sampleBulletins = [
  {
    title:
      'Zaman Damgalı Özet (Türkçe) - "TARİHİ ÇÖKÜŞ / BOĞA TUZAĞINA GİDİYORUZ!"',
    summary:
      "Trump’ın Çin'e %100 vergi çıkışıyla başlayan sert düşüşler, ardından gelen 'her şey yolunda' açıklamasıyla toparlandı. Ancak bu süreç, ABD başkanının piyasa manipülasyonu yaptığı şüphelerini artırdı. Kriptoda 400 milyar $’lık erime sonrası 'boğa tuzağı' uyarısı yapılıyor; altın ve gümüşte yükseliş trendi korunuyor.",
    channelId: "Selcoin",
    videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
    publishDate: new Date("2025-10-15"),
    tags: [
      "Trump",
      "Kripto",
      "Altın",
      "Gümüş",
      "Manipülasyon",
      "Boğa tuzağı",
      "Piyasa analizi",
      "Binance",
      "Bitcoin",
      "ABD borsası",
    ],
    duration: "16:13",
    thumbnail: "https://img.youtube.com/vi/4P5AakBK-L4/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:06",
        text: "Haftalık açılışta toparlanma görülüyor: ABD borsaları, kripto, altın ve gümüşte yükseliş başladı.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "00:34",
        text: "Cuma günü Trump, Çin’e vergileri %100 artıracağını açıkladı; piyasa çöktü.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "01:04",
        text: "Pazar günü 'Her şey yolunda' mesajıyla piyasalar toparladı.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "01:36",
        text: "Trump’ın stratejisi: 'Önce korkut, sonra güven ver' – tüccar refleksiyle piyasa yönetimi.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "02:04",
        text: "Trump’ın oğlunun düşüşten önce 80 milyon dolarlık şort pozisyon açtığı iddiası.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "02:52",
        text: "Kripto piyasası artık devlet gücünün ve jeopolitik stratejilerin aracı haline geldi.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "03:20",
        text: "Vadeli piyasalarda 400 milyar dolarlık erime, yatırımcı intihar vakaları.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "04:06",
        text: "Altın 3940 destek bölgesinden toparlandı; yükseliş trendi korunuyor.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "05:30",
        text: "Gram altın 5500 TL civarında; 5300 destek seviyesi.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "05:48",
        text: "6450 TL yıl sonu hedefi korunuyor.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "06:09",
        text: "Darphane Altın Sertifikası altından ayrıştı, yatırımcıya önerilmiyor.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "06:54",
        text: "Gümüş 4795 üzerinde güçlü seyrediyor; boşluk alanda yükseliş devam ediyor.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "07:59",
        text: "ABD hükümet açılana kadar altın ve gümüşte yükseliş sürecek, sonrasında kısa düzeltme bekleniyor.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "08:20",
        text: "Borsa İstanbul bulut altına indi, görünüm zayıf.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "09:20",
        text: "ABD borsaları Trump açıklamalarıyla dalgalandı ama trend bozulmadı.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "10:15",
        text: "Kripto piyasasında en sert düşüş: Bitcoin 104.000’den toparladı.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "11:00",
        text: "Trump’ın yöntemine 'manipülasyon' deniyor; görev süresini tamamlayamayabilir.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "11:42",
        text: "Yatırımcılara uyarı: 'Elinde tutuyorsan o para senindir.' Donanım cüzdan önerisi.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "13:16",
        text: "Ethereum, XRP, Solana gibi altcoinlerde toparlanma sinyali.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "14:06",
        text: "'Boğa tuzağı' kuruldu; altcoinler manipülasyonla aşağı çekildi.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "15:28",
        text: "Küçük yatırımcı zarar etti ama sabırlı olanlar kazanacak.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "15:54",
        text: "Katıl topluluğu stratejisiyle zararı minimize etti.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
      },
      {
        time: "16:13",
        text: "Fiyatlar ne olursa olsun, keyfiniz yerinde olsun.",
        videoUrl: "https://www.youtube.com/watch?v=4P5AakBK-L4",
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
