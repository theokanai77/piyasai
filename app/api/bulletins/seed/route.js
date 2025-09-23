import connectMongo from "@/libs/mongoose";
import Bulletin from "@/models/Bulletin";

// Sample data based on the existing sampleVideos structure
const sampleBulletins = [
  {
    title: 'Zaman Damgalı Özet (Türkçe) - "Altın Rekoruna 25 Dolar"',
    summary:
      "Finansal uzman Çiğdem Çiçek'in altın ve gümüş piyasaları hakkındaki detaylı analizi. Eylül 2025 yatırım stratejileri, teknik analiz ve portföy çeşitlendirme önerileri.",
    channelId: "Çiğdem Çiçek",
    videoUrl: "https://youtube.com/watch?v=sample1",
    publishDate: new Date("2024-01-15"),
    tags: ["altın", "gümüş", "yatırım", "finansal analiz", "Eylül 2025"],
    duration: "10:15",
    thumbnail: "https://img.youtube.com/vi/sample1/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:01",
        text: 'Yeni ay/hafta: 1 Eylül 2025; odak "altın & gümüş" piyasaları ve yatırım stratejileri',
        videoUrl: "https://youtube.com/watch?v=sample1",
      },
      {
        time: "00:56",
        text: "Altın fiyatlarında son durum ve teknik analiz",
        videoUrl: "https://youtube.com/watch?v=sample1",
      },
      {
        time: "02:29",
        text: "15 Eylül'e kadar Yüksek Mahkeme süreci; olası kayıp senaryoları",
        videoUrl: "https://youtube.com/watch?v=sample1",
      },
      {
        time: "04:12",
        text: "Gümüş yatırımı için öneriler ve risk değerlendirmesi",
        videoUrl: "https://youtube.com/watch?v=sample1",
      },
      {
        time: "06:45",
        text: "Dolar/TL paritesi ve etkileri",
        videoUrl: "https://youtube.com/watch?v=sample1",
      },
      {
        time: "08:30",
        text: "Portföy çeşitlendirme stratejileri",
        videoUrl: "https://youtube.com/watch?v=sample1",
      },
      {
        time: "10:15",
        text: "Sonuç ve öneriler",
        videoUrl: "https://youtube.com/watch?v=sample1",
      },
    ],
  },
  {
    title: 'Zaman Damgalı Özet (TR) - "Şehirler, Fiyatlar & Emlak Vergisi"',
    summary:
      "İslam Memiş'in emlak piyasası analizi. İstanbul ve diğer şehirlerdeki konut fiyatları, emlak vergisi hesaplamaları ve yatırım önerileri.",
    channelId: "İslam Memiş",
    videoUrl: "https://youtube.com/watch?v=sample2",
    publishDate: new Date("2024-01-14"),
    tags: ["emlak", "konut", "emlak vergisi", "İstanbul", "yatırım"],
    duration: "08:05",
    thumbnail: "https://img.youtube.com/vi/sample2/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:01",
        text: 'Yayının amacı: yaz sonu konut piyasası fotoğrafı; "çalışma modu" ve günün 3. videosu',
        videoUrl: "https://youtube.com/watch?v=sample2",
      },
      {
        time: "00:46",
        text: "İstanbul emlak piyasasında son gelişmeler",
        videoUrl: "https://youtube.com/watch?v=sample2",
      },
      {
        time: "02:01",
        text: "Emlak vergisi hesaplama yöntemleri ve güncellemeler",
        videoUrl: "https://youtube.com/watch?v=sample2",
      },
      {
        time: "04:20",
        text: "Şehir bazında emlak fiyat analizleri",
        videoUrl: "https://youtube.com/watch?v=sample2",
      },
      {
        time: "06:10",
        text: "Yatırım için en uygun bölgeler ve gelecek projeksiyonları",
        videoUrl: "https://youtube.com/watch?v=sample2",
      },
      {
        time: "08:05",
        text: "Sonuç ve öneriler",
        videoUrl: "https://youtube.com/watch?v=sample2",
      },
    ],
  },
  {
    title: "Kripto Para Analizi - Bitcoin ve Altcoin Trendleri",
    summary:
      "Elit Finans ekibinin kripto para piyasasındaki son gelişmeleri ve Bitcoin, Ethereum başta olmak üzere önemli altcoinlerin teknik analizi.",
    channelId: "Elit Finans",
    videoUrl: "https://youtube.com/watch?v=sample3",
    publishDate: new Date("2024-01-13"),
    tags: ["kripto", "bitcoin", "ethereum", "altcoin", "blockchain"],
    duration: "12:30",
    thumbnail: "https://img.youtube.com/vi/sample3/maxresdefault.jpg",
    timestamps: [
      {
        time: "00:01",
        text: "Kripto para piyasasında genel durum ve trend analizi",
        videoUrl: "https://youtube.com/watch?v=sample3",
      },
      {
        time: "02:15",
        text: "Bitcoin teknik analizi ve destek-direnç seviyeleri",
        videoUrl: "https://youtube.com/watch?v=sample3",
      },
      {
        time: "05:20",
        text: "Ethereum gelişmeleri ve DeFi ekosistemi",
        videoUrl: "https://youtube.com/watch?v=sample3",
      },
      {
        time: "08:45",
        text: "Altcoin seçimi ve portföy dağılımı önerileri",
        videoUrl: "https://youtube.com/watch?v=sample3",
      },
      {
        time: "11:10",
        text: "Risk yönetimi ve stop-loss stratejileri",
        videoUrl: "https://youtube.com/watch?v=sample3",
      },
    ],
  },
];

export async function POST(request) {
  try {
    await connectMongo();

    // Clear existing bulletins (optional - remove this if you want to keep existing data)
    //await Bulletin.deleteMany({});

    // Insert sample bulletins
    const insertedBulletins = await Bulletin.insertMany(sampleBulletins);

    return Response.json({
      success: true,
      message: `Successfully seeded ${insertedBulletins.length} bulletins`,
      data: insertedBulletins,
    });
  } catch (error) {
    console.error("Error seeding bulletins:", error);
    return Response.json(
      { success: false, error: "Failed to seed bulletins" },
      { status: 500 }
    );
  }
}
