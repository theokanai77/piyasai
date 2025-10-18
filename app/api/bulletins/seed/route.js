import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Sample data based on the existing sampleVideos structure
const sampleBulletins = [
  {
    title: 'Zaman Damgalı Özet (Türkçe) - "ALTIN KIRIP GEÇİRECEK"',
    summary:
      "Altın 4.150$, gümüş 53$ seviyesinde. Bankalar 2026 için 5.000$ altın, 55$ gümüş tahmini yaparken, anlatıcı altın için 6.000$, gümüş için 100$ öngörüyor. Jeopolitik riskler, Çin’in altın alımları, Fed’in olası faiz indirimleri ve Trump etkisi yeni bir değerli maden rallisini başlatıyor.",
    channelId: "Selçuk Geçer",
    videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E",
    publishDate: new Date("2025-10-18"),
    tags: [
      "altın",
      "gümüş",
      "ons",
      "Bitcoin",
      "Ethereum",
      "faiz indirimi",
      "Trump",
      "Fed",
      "yapay zeka",
      "Nvidia",
      "AMD",
      "Societe Generale",
      "Citybank",
      "Goldman Sachs",
      "Çin ihracatı",
      "jeopolitik risk",
    ],
    duration: "11:32",
    thumbnail: "https://img.youtube.com/vi/U2tsWmVYY5E/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:00",
        text: "Altın 4.150$, gümüş 53$: Bankalar yeni hedefler açıklıyor — City 55$, SocGen 5.000$ altın.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=0s",
      },
      {
        time: "01:42",
        text: "2026’da gümüş 100$, altın 6.000$: Bankaların tahminleri ‘temkinli’.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=102s",
      },
      {
        time: "02:32",
        text: "Altına talep: Merkez bankaları, fonlar, bireysel yatırımcılar yöneliyor.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=152s",
      },
      {
        time: "02:57",
        text: "Tahvillerden kaçış: Para Bitcoin, altın, gümüş ve hisselere gidiyor.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=177s",
      },
      {
        time: "03:44",
        text: "ABD–Çin gerilimi, jeopolitik risk olarak altını besliyor.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=224s",
      },
      {
        time: "04:10",
        text: "Çin ihracatı rekor kırıyor; rezervleriyle altın/gümüş alımında artış.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=250s",
      },
      {
        time: "05:16",
        text: "Çin’in gizli altın alımları tahminlerin üstünde.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=316s",
      },
      {
        time: "05:37",
        text: "Fed guvernörü Waller: ‘Faiz indirimi daha agresif olmalı.’",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=337s",
      },
      {
        time: "06:29",
        text: "Trump etkisiyle yeni Fed dönemi: Agresif faiz indirimi bekleniyor.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=389s",
      },
      {
        time: "07:14",
        text: "Yapay zekâ rallisi: Amazon ve Google’un ilk yıllarına benzetiliyor.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=434s",
      },
      {
        time: "08:03",
        text: "Altın 10.000$ potansiyeli, Bitcoin 300–500 bin$ hedefi konuşuluyor.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=483s",
      },
      {
        time: "09:22",
        text: "Kriptolarda temizlik: Çoğu yok olacak, kalanlar yükselecek.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=562s",
      },
      {
        time: "09:47",
        text: "Bankacılık ve sanayi hisselerinde yeni yükseliş döngüsü bekleniyor.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=587s",
      },
      {
        time: "10:49",
        text: "Çin–ABD rekabeti üretimi artırıyor; piyasalar canlı kalacak.",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=649s",
      },
      {
        time: "11:10",
        text: "‘Ana trend yukarı, ara satışlar hikayeyi bozmaz.’",
        videoUrl: "https://www.youtube.com/watch?v=U2tsWmVYY5E&t=670s",
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
