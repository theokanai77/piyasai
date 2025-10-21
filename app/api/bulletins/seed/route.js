import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Sample data based on the existing sampleVideos structure
const sampleBulletins = [
  {
    title:
      'Zaman Damgalı Özet (Türkçe) - "Altında çöküş bekleyenin elleri yine boş kaldı…"',
    summary:
      "Video, altın tarafında 'çöküş' bekleyen görüşlere karşı boğa trendinin majörde korunduğunu savunuyor. Saatlikte ara bozulumlar görülse de 4 saatlik/haftalık yapı yukarı; 4060 üstü haftalık kapanışlar trend teyidi olarak ele alınıyor. Fiziki arz sıkışıklığı, tahvil piyasasından altına olası talep ve 'itibari para' riskleri ana temel. Makas/işçilik nedeniyle kısa vadeli al-sat yerine majör döngü takibi öneriliyor.",
    channelId: "Elit Finans",
    videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio",
    publishDate: new Date("2025-10-21"),
    tags: [
      "altın",
      "ons",
      "boğa piyasası",
      "düzeltme",
      "trend",
      "fiziki altın",
      "itibari para",
      "tahvil piyasası",
      "merkez bankaları",
      "kripto",
      "BIST",
      "konut",
    ],
    duration: "2:05:14",
    thumbnail: "https://img.youtube.com/vi/Azz25i3Xqio/maxresdefault.jpg",
    timestamps: [
      {
        time: "01:42",
        text: "Kısa vade 15 dk periyotla okuma; anlık senaryo.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=102s",
      },
      {
        time: "06:20",
        text: "Makas/işçilik: Tepeden verip alttan alma çoğu yatırımcıda işlemiyor.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=380s",
      },
      {
        time: "08:02",
        text: "“4060 üstünde başka bir dünya var”; haftalık kapanış vurgusu.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=482s",
      },
      {
        time: "09:51",
        text: "Saatlik bozulsa da 4 saatlik ağ yukarı; düzeltmeler normali.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=591s",
      },
      {
        time: "10:17",
        text: "Fiziki altın arzı ve teslimat ayları önem kazanıyor.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=617s",
      },
      {
        time: "12:08",
        text: "“İtibari paralardan uzak durun”; altını satıp dolar beklemek riskli.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=728s",
      },
      {
        time: "13:56",
        text: "İhtiyaç (konut/araç) ayrı; spekülatif döngüyle karıştırmayın.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=836s",
      },
      {
        time: "17:57",
        text: "4060–4242 bandı ve haftalık kapanış senaryoları.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=1077s",
      },
      {
        time: "18:55",
        text: "Fibo geri çekilmesi 4000 civarı bile büyük resmi bozmaz (bayrak).",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=1135s",
      },
      {
        time: "23:17",
        text: "“Değer kaybeden altın değil; para birimleri.”",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=1397s",
      },
      {
        time: "24:54",
        text: "Altın düşerken daha sert düşecek enstrümanlarla parite/takas fırsatı.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=1494s",
      },
      {
        time: "29:44",
        text: "Ekim 2023’ten beri ana boğa; erken uyarı vurgusu.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=1784s",
      },
      {
        time: "35:27",
        text: "Trend açısı hızlanıyor; düzeltmeler boğayı öldürmüyor.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=2137s",
      },
      {
        time: "41:47",
        text: "Kalabalığın narası çoğu zaman ters indikatör.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=2507s",
      },
      {
        time: "57:43",
        text: "Rasio dip bölgesi: metal alacaksam altın tercihi.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=3463s",
      },
      {
        time: "1:00:00",
        text: "Rasyoda 83 direnç, 23 Ekim sıkışma.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=3600s",
      },
      {
        time: "1:03:18",
        text: "Altcoin boğasıyla küçük yatırımcıyı tuzağa çektiler.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=3798s",
      },
      {
        time: "1:04:38",
        text: "Makastan altın alınmaz, kapanmadan alım yok.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=3878s",
      },
      {
        time: "1:07:08",
        text: "İndikatörlere körü körüne güvenmeyin.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=4028s",
      },
      {
        time: "1:11:32",
        text: "Fiziki gümüşte arz kalmadı, Asya’da kuyruklar.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=4292s",
      },
      {
        time: "1:15:16",
        text: "Altını bu seviyeden çökertirlerse aptaldırlar.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=4516s",
      },
      {
        time: "1:17:50",
        text: "Altında balon yok; Nasdaq’ta var.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=4670s",
      },
      {
        time: "1:21:46",
        text: "Trend takipçisi ol, panikleme.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=4906s",
      },
      {
        time: "1:24:24",
        text: "3. Dünya Savaşı biyolojik ve ekonomik düzeyde başladı.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=5064s",
      },
      {
        time: "1:52:54",
        text: "Altın yatırım değil, paradır.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=6774s",
      },
      {
        time: "2:04:47",
        text: "Emeğini çalanlara helal etmem.",
        videoUrl: "https://www.youtube.com/watch?v=Azz25i3Xqio&t=7487s",
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
