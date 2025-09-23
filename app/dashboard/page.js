import FinAlAnalytics from "@/components/FinAlAnalytics";

export const dynamic = "force-dynamic";

// Sample data for the FinAl Analytics dashboard
const sampleChannels = [
  {
    name: "Çiğdem Çiçek",
    avatarColor: "blue",
    videoCount: 3,
    isActive: true,
  },
  {
    name: "İslam Memiş",
    avatarColor: "green",
    videoCount: 3,
    isActive: true,
  },
  {
    name: "Elit Finans",
    avatarColor: "purple",
    videoCount: 2,
    isActive: true,
  },
  {
    name: "Devrim Akyıl",
    avatarColor: "orange",
    videoCount: 2,
    isActive: true,
  },
];

const sampleVideos = [
  {
    title: 'Zaman Damgalı Özet (Türkçe) - "Altın Rekoruna 25 Dolar"',
    channel: "Çiğdem Çiçek",
    videoUrl: "https://youtube.com/watch?v=sample1",
    publishDate: "2024-01-15",
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
    channel: "İslam Memiş",
    videoUrl: "https://youtube.com/watch?v=sample2",
    publishDate: "2024-01-14",
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
];

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  return (
    <main className="min-h-screen">
      <FinAlAnalytics channels={sampleChannels} videos={sampleVideos} />
    </main>
  );
}
