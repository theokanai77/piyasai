import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import FinAlAnalytics from "@/components/FinAlAnalytics";
import User from "@/models/User";
import connectMongo from "@/libs/mongoose";

export const dynamic = "force-dynamic";

// Loading component for Suspense
function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-4 mx-auto animate-pulse">
          <span className="text-white font-bold text-xl">⚡</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">FinAl Analytics</h2>
        <p className="text-gray-400">Veriler yükleniyor...</p>
        <div className="mt-4 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Fallback data in case API calls fail
const fallbackChannels = [
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

const fallbackVideos = [
  {
    title: 'Zaman Damgalı Özet (Türkçe) - "Altın Rekoruna 25 Dolar"',
    summary: "Bu videonun AI özeti: Altın Rekoruna 25 Dolar",
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
    ],
  },
  {
    title: 'Zaman Damgalı Özet (TR) - "Şehirler, Fiyatlar & Emlak Vergisi"',
    summary: "Bu videonun AI özeti: Şehirler, Fiyatlar & Emlak Vergisi",
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
    ],
  },
];

// Function to fetch channels data
async function fetchChannels() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://www.kaplanokan.com"
        : "http://localhost:3000");
    const response = await fetch(`${baseUrl}/api/channels`, {
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(`Channels API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch channels");
    }

    return data.data || [];
  } catch (error) {
    console.error("Error fetching channels:", error);
    return fallbackChannels;
  }
}

// Function to fetch bulletins data
async function fetchBulletins() {
  try {
    // Get user session for filtering
    const session = await getServerSession(authOptions);
    let followedChannels = [];

    if (session?.user?.id) {
      try {
        await connectMongo();
        const user = await User.findById(session.user.id);
        followedChannels = user ? user.followedChannels : [];
      } catch (dbError) {
        console.error("Error fetching user followed channels:", dbError);
        // Continue with empty array if DB error
      }
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://www.kaplanokan.com"
        : "http://localhost:3000");
    const response = await fetch(`${baseUrl}/api/bulletins/all`, {
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(`Bulletins API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch bulletins");
    }

    // Transform bulletins to match FinAlAnalytics expected format
    const transformedData = data.data.map((bulletin) => ({
      title: bulletin.title,
      summary: bulletin.summary,
      channel: bulletin.channelId,
      videoUrl: bulletin.videoUrl,
      publishDate: bulletin.publishDate,
      timestamps: bulletin.timestamps || [],
    }));

    // Filter by followed channels if user has followed channels
    if (followedChannels.length > 0) {
      return transformedData.filter((bulletin) =>
        followedChannels.includes(bulletin.channel)
      );
    }

    return transformedData || [];
  } catch (error) {
    console.error("Error fetching bulletins:", error);

    // Apply fallback filtering for MVP
    const filteredFallback = fallbackVideos.filter((v) => true); // Show all for now
    return filteredFallback;
  }
}

// Dashboard content component that fetches data
async function DashboardContent() {
  // Fetch data in parallel
  const [channels, videos] = await Promise.all([
    fetchChannels(),
    fetchBulletins(),
  ]);

  return (
    <main className="min-h-screen">
      <FinAlAnalytics channels={channels} videos={videos} />
    </main>
  );
}

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server component which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
