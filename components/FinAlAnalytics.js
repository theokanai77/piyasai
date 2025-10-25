"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Icon Components
const BullIcon = () => (
  <svg
    className="w-5 h-5 inline-block mr-1"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const BearIcon = () => (
  <svg
    className="w-5 h-5 inline-block mr-1"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.707-11.707a1 1 0 00-1.414 0L9 7.586V4a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const NeutralIcon = () => (
  <svg
    className="w-5 h-5 inline-block mr-1"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const LightbulbIcon = () => (
  <svg
    className="w-8 h-8 text-yellow-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    ></path>
  </svg>
);

const LinkIcon = () => (
  <svg
    className="w-4 h-4 inline-block ml-2 text-cyan-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    ></path>
  </svg>
);

// Helper Functions
const convertTimestampToSeconds = (timestamp) => {
  if (typeof timestamp !== "string" || timestamp.trim() === "") return 0;
  const parts = timestamp.split(":").map((s) => parseInt(s.trim(), 10));
  if (parts.some(isNaN) || parts.length === 0 || parts.length > 3) return 0;
  return parts
    .reverse()
    .reduce((acc, val, index) => acc + val * Math.pow(60, index), 0);
};

const formatPublishDate = (dateString) => {
  if (!dateString) return "Tarih yok";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return "Tarih yok";
  }
};

// SentimentCell Component
const SentimentCell = ({ sentiment }) => {
  const styles = {
    Pozitif: "bg-green-800 text-green-200",
    Negatif: "bg-red-800 text-red-200",
    Nötr: "bg-gray-600 text-gray-200",
    "Veri Yok": "bg-gray-700 text-gray-400",
  };
  const icons = {
    Pozitif: <BullIcon />,
    Negatif: <BearIcon />,
    Nötr: <NeutralIcon />,
  };

  // Handle undefined/empty sentiment
  if (!sentiment || sentiment === undefined || sentiment === "") {
    return (
      <td className="px-4 py-3 text-sm whitespace-nowrap">
        <span className="bg-gray-700 text-gray-400 px-3 py-1 rounded-full text-sm">
          Veri Yok
        </span>
      </td>
    );
  }

  return (
    <td className="px-4 py-3 text-sm whitespace-nowrap">
      <span
        className={`px-3 py-1 font-semibold leading-tight rounded-full ${
          styles[sentiment] || styles["Veri Yok"]
        }`}
      >
        {icons[sentiment]} {sentiment}
      </span>
    </td>
  );
};

// SummaryCard Component
const SummaryCard = ({ summary }) => {
  const seconds = convertTimestampToSeconds(summary.timestamp);
  const videoUrl = `https://www.youtube.com/watch?v=${summary.videoId}&t=${seconds}s`;
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-cyan-500 hover:bg-gray-700/50 transition-all duration-300 transform hover:-translate-y-1"
    >
      <h4 className="text-lg font-bold text-white mb-2">{summary.analyst}</h4>
      <p className="text-gray-300 flex-grow">&ldquo;{summary.quote}&rdquo;</p>
      <div className="text-right text-sm font-mono text-cyan-400 mt-4">
        {summary.timestamp} <LinkIcon />
      </div>
    </a>
  );
};

export default function FinAlAnalytics({ channels = [], videos = [] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("video-summaries");
  const [searchTerm] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState("all");
  const [expandedVideos, setExpandedVideos] = useState(new Set());
  const [expandedSummaries, setExpandedSummaries] = useState(() => {
    return new Set(videos.map((_, index) => index));
  });
  const [followedChannels, setFollowedChannels] = useState([]);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Client-side check for xVerified - supplements server-side protection
  useEffect(() => {
    if (session === undefined) return;
    setIsChecking(false);
    if (session?.user?.xVerified === false) {
      router.push("/verification-denied");
    }
  }, [session, router]);

  // Fetch followed channels when user is authenticated
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/follow-channels")
        .then((res) => res.json())
        .then((data) => setFollowedChannels(data.followedChannels || []));
    }
  }, [session]);

  // Filter videos based on search term, selected channel, and followed channels
  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChannel =
      selectedChannelId === "all" || video.channel === selectedChannelId;

    // Filter by followed channels if user is authenticated and has followed channels
    const matchesFollowedChannels =
      followedChannels.length === 0 || followedChannels.includes(video.channel);

    return matchesSearch && matchesChannel && matchesFollowedChannels;
  });

  // Filter channels based on search term
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dynamic stats based on filtered videos (for video list)
  const totalVideos = filteredVideos.length;

  // Stats Cards - Always show total numbers from all bulletins (no filtering)
  // Use useMemo to ensure these values are stable and don't change based on user interactions
  const statsTotalVideos = useMemo(() => videos.length, [videos]);
  const statsTotalChannels = useMemo(() => channels.length, [channels]);
  const statsTotalTimestamps = useMemo(() => {
    return videos.reduce((total, video) => {
      return total + (video.timestamps ? video.timestamps.length : 0);
    }, 0);
  }, [videos]);

  const handleTimestampClick = (videoUrl, timestamp) => {
    // Extract time in seconds from timestamp (e.g., "00:01" -> 1 second)
    const timeMatch = timestamp.match(/(\d+):(\d+)/);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      const seconds = parseInt(timeMatch[2]);
      const totalSeconds = minutes * 60 + seconds;
      window.open(`${videoUrl}&t=${totalSeconds}s`, "_blank");
    } else {
      window.open(videoUrl, "_blank");
    }
  };

  const handleChannelClick = (channelId) => {
    setSelectedChannelId(channelId);
  };

  const handleYouTubeClick = (videoUrl) => {
    if (videoUrl) {
      window.open(videoUrl, "_blank");
    }
  };

  const toggleTimestamps = (videoIndex) => {
    setExpandedVideos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoIndex)) {
        newSet.delete(videoIndex);
      } else {
        newSet.add(videoIndex);
      }
      return newSet;
    });
  };

  const toggleSummary = (videoIndex) => {
    setExpandedSummaries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoIndex)) {
        newSet.delete(videoIndex);
      } else {
        newSet.add(videoIndex);
      }
      return newSet;
    });
  };

  // Toggle follow status for a channel
  const toggleFollowChannel = async (channelName) => {
    if (!session?.user?.id) return;

    setLoadingFollow(true);
    try {
      const response = await fetch("/api/follow-channels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channelName }),
      });

      if (response.ok) {
        const data = await response.json();
        setFollowedChannels(data.followedChannels);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  // Handle toggle for channel cards
  const handleToggle = async (channelName) => {
    if (!session?.user?.id) return;

    setLoadingFollow(true);
    try {
      const res = await fetch("/api/follow-channels", {
        method: "POST",
        body: JSON.stringify({ channelName: channelName }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setFollowedChannels(data.followedChannels);
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  if (isChecking)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Checking verification...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Bar */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Piyasai Analytics
                </h1>
                <p className="text-sm text-gray-400">
                  Küçük Yatırımcı Dostu Platform
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("video-summaries")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "video-summaries"
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="mr-2">▷</span>
                Video Özetleri
              </button>
              <button
                onClick={() => setActiveTab("varliklar")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "varliklar"
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="mr-2">💰</span>
                Haftalık Rapor
              </button>
            </div>

            {/* Followed Channels Status */}
            {session?.user?.id && (
              <div className="flex items-center space-x-2 bg-orange-800 rounded-lg px-3 py-2">
                <span className="text-orange-400">👥</span>
                <span className="text-sm text-white">
                  {followedChannels.length} Kanal Takip Ediliyor
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === "video-summaries" ? (
          <>
            {/* AI Destekli Video Analizleri Section */}
            <section className="mb-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  <span className="text-orange-500">⚡</span> Video Özet
                  Analizleri
                </h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  Finansal uzmanların görüşlerini analiz edip,{" "}
                  <span className="text-orange-500 font-semibold">
                    dakika dakika özetlerle
                  </span>{" "}
                  sunan platform
                </p>
                <p className="text-xs text-gray-300 max-w-3xl mx-auto">
                  Bu platformda bulunan bilgiler yatırım danışmanlığı kapsamında
                  olmadığı gibi yatırım tavsiyesi değildir. Yapılan özetler
                  bireysel görüşlerimdir. Videoların tamamını izlemeniz
                  önerilir.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="text-4xl font-bold text-white mb-2">
                    {statsTotalVideos}
                  </div>
                  <div className="text-gray-400">Video Analizi</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="text-4xl font-bold text-white mb-2">
                    {statsTotalChannels}
                  </div>
                  <div className="text-gray-400">
                    <span className="text-green-400">Uzm. Ekonomist</span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="text-4xl font-bold text-white mb-2">
                    {statsTotalTimestamps}+
                  </div>
                  <div className="text-gray-400">
                    <span className="text-blue-400">Dakika Damgası</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Followed Channels Filter Status */}
            {session?.user?.id && followedChannels.length > 0 && (
              <div className="mb-6 p-4 bg-orange-900/20 border border-orange-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-400">👥</span>
                    <span className="text-white font-medium">
                      Sadece takip ettiğin kanallar gösteriliyor
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {followedChannels.map((channel, index) => (
                      <span
                        key={index}
                        className="bg-orange-800 text-orange-200 px-2 py-1 rounded-full text-xs"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Channel Cards */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Kanal Listesi
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
                {/* All Channels Card */}
                <div
                  onClick={() => handleChannelClick("all")}
                  className={`rounded-lg p-2 md:p-3 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 cursor-pointer ${
                    selectedChannelId === "all"
                      ? "bg-orange-800 ring-2 ring-orange-400"
                      : "bg-gray-800"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar - Hidden on mobile */}
                    <div className="w-10 h-10 rounded-full items-center justify-center mb-2 bg-gray-600 hidden md:flex">
                      <span className="text-white text-sm">📺</span>
                    </div>
                    <h3 className="font-bold text-white mb-1 text-xs md:text-xs leading-tight">
                      Tüm Takip Edilen Kanallar
                    </h3>
                    <div className="flex items-center space-x-1 md:space-x-2 text-gray-400 text-xs">
                      <span>▷ {totalVideos} video</span>
                      <span>•</span>
                      <span
                        className={
                          followedChannels.length > 0
                            ? "text-green-400"
                            : "text-gray-400"
                        }
                      >
                        {followedChannels.length > 0 ? "Aktif" : "Pasif"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Individual Channel Cards */}
                {filteredChannels.map((channel, index) => {
                  const isFollowed = followedChannels.includes(channel.name);
                  return (
                    <div
                      key={index}
                      className={`group relative rounded-lg p-2 md:p-3 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 ${
                        selectedChannelId === channel.name
                          ? "bg-orange-800 ring-2 ring-orange-400"
                          : "bg-gray-800"
                      }`}
                    >
                      {/* Toggle Button - Top Right Corner */}
                      {session?.user?.id && (
                        <button
                          onClick={() => handleToggle(channel.name)}
                          className={`absolute top-1 right-1 rounded-full p-1 hover:scale-110 transition opacity-0 group-hover:opacity-100 ${
                            followedChannels.includes(channel.name)
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                          disabled={loadingFollow}
                        >
                          {followedChannels.includes(channel.name)
                            ? "❤️"
                            : "🤍"}
                        </button>
                      )}
                      <div className="flex flex-col items-center text-center">
                        {/* Avatar - Hidden on mobile */}
                        <div
                          className={`w-10 h-10 rounded-full items-center justify-center mb-2 hidden md:flex ${
                            channel.avatarColor === "blue"
                              ? "bg-blue-500"
                              : channel.avatarColor === "green"
                              ? "bg-green-500"
                              : channel.avatarColor === "purple"
                              ? "bg-purple-500"
                              : "bg-orange-500"
                          }`}
                        >
                          <span className="text-white text-sm">👤</span>
                        </div>
                        <h3 className="font-bold text-white mb-1 text-xs md:text-xs leading-tight">
                          {channel.name}
                        </h3>
                        <div className="flex items-center space-x-1 md:space-x-2 text-gray-400 text-xs mb-1">
                          <span>▷ {channel.videoCount} video</span>
                          <span>•</span>
                          <span
                            className={
                              isFollowed ? "text-green-400" : "text-gray-400"
                            }
                          >
                            {isFollowed ? "Aktif" : "Pasif"}
                          </span>
                        </div>

                        {/* Follow Button - Mobile Only */}
                        {session?.user?.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFollowChannel(channel.name);
                            }}
                            disabled={loadingFollow}
                            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors md:hidden ${
                              isFollowed
                                ? "bg-orange-500 hover:bg-orange-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                            } ${
                              loadingFollow
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {loadingFollow ? (
                              <span className="flex items-center justify-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Yükleniyor...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center">
                                <span className="mr-1">
                                  {isFollowed ? "✓" : "+"}
                                </span>
                                {isFollowed ? "Takip Ediliyor" : "Takip Et"}
                              </span>
                            )}
                          </button>
                        )}

                        {/* Channel Click Area */}
                        <div
                          onClick={() => handleChannelClick(channel.name)}
                          className="w-full mt-2 cursor-pointer"
                        >
                          <div className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                            Videoları İçin Tıkla
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Tüm Videolar Section - Only show if user has followed channels */}
            {session?.user?.id && followedChannels.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Tüm Videolar
                  </h2>
                  <span className="bg-gray-800 rounded-lg px-3 py-1 text-sm text-gray-400">
                    {filteredVideos.length} video bulundu
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredVideos.map((video, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg p-6 shadow-lg"
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <button
                          onClick={() => handleYouTubeClick(video.videoUrl)}
                          className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                        >
                          <span className="text-white text-lg">▷</span>
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-bold text-white">
                              {video.channel}
                            </h3>
                            <span className="text-gray-400 text-sm">
                              Finansal Analiz
                            </span>
                          </div>
                          <h4 className="text-white font-semibold mb-2 line-clamp-2">
                            {video.title}
                          </h4>
                          {video.publishDate && (
                            <div className="flex items-center space-x-2 mb-2 text-sm text-gray-400">
                              <span className="text-xs">📅</span>
                              <span>
                                {(() => {
                                  try {
                                    return formatPublishDate(video.publishDate);
                                  } catch (error) {
                                    console.error(
                                      "Publish date render hatası debug et:",
                                      error
                                    );
                                    return "Tarih yok";
                                  }
                                })()}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                            <span className="flex items-center space-x-1">
                              <span>🕐</span>
                              <span>
                                {video.timestamps.length} zaman damgası
                              </span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>⚡</span>
                              <span>AI analizi</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mb-4">
                        <button
                          onClick={() => handleYouTubeClick(video.videoUrl)}
                          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <span>📺</span>
                          <span>YouTube&apos;da İzle</span>
                        </button>
                        <button
                          onClick={() => toggleSummary(index)}
                          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <span>
                            {expandedSummaries.has(index) ? "↑" : "↓"}
                          </span>
                          <span>
                            {expandedSummaries.has(index)
                              ? "Detayları Gizle"
                              : "Detayları Gör"}
                          </span>
                        </button>
                      </div>

                      {/* Timestamps */}
                      <div className="border-t border-gray-700 pt-4">
                        <h5 className="text-white font-semibold mb-3">
                          Kilit Dakikalar:
                        </h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {(expandedVideos.has(index)
                            ? video.timestamps
                            : video.timestamps.slice(0, 3)
                          ).map((timestamp, tsIndex) => (
                            <div key={tsIndex} className="text-sm">
                              <button
                                onClick={() =>
                                  handleTimestampClick(
                                    video.videoUrl,
                                    timestamp.time
                                  )
                                }
                                className="text-blue-400 hover:text-blue-300 hover:underline font-medium mr-2"
                              >
                                {timestamp.time}
                              </button>
                              <span className="text-gray-400">
                                {timestamp.text}
                              </span>
                            </div>
                          ))}
                          {video.timestamps.length > 3 && (
                            <button
                              onClick={() => toggleTimestamps(index)}
                              className="text-blue-400 hover:text-blue-300 text-sm hover:underline"
                            >
                              {expandedVideos.has(index)
                                ? "Daha az göster"
                                : `+${
                                    video.timestamps.length - 3
                                  } daha fazla önemli dakika...`}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded AI Summary Section */}
                      {expandedSummaries.has(index) && (
                        <div className="border-t border-gray-700 pt-4 mt-4">
                          <h5 className="text-white font-semibold mb-3 flex items-center">
                            <span className="mr-2">🧠</span>
                            AI Özeti
                          </h5>
                          <div className="bg-gray-700 rounded-lg p-4">
                            <div className="mb-3">
                              <h6 className="text-orange-400 font-semibold text-sm mb-2">
                                {video.title}
                              </h6>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {video.summary}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : activeTab === "varliklar" ? (
          <VarliklarTab />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-4">
        <div className="container mx-auto px-4 flex justify-end">
          <div className="bg-gray-800 rounded-lg px-3 py-1 text-sm text-gray-400">
            <span className="mr-2"></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function VarliklarTab() {
  // State for followed channels
  const [followedChannels, setFollowedChannels] = useState([]);
  const { data: session } = useSession();

  // Fetch followed channels on component mount
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/follow-channels")
        .then((res) => res.json())
        .then((data) => setFollowedChannels(data.followedChannels || []))
        .catch((error) =>
          console.error("Error fetching followed channels:", error)
        );
    }
  }, [session]);

  // Hardcoded report data from tematik.html
  const reportData = {
    weekOf: "24 Ekim 2025 Haftası",
    bigPictureSummary: {
      summary:
        "Bu hafta piyasalar, TCMB'nin 100 baz puanlık faiz indirimi ve küresel jeopolitik risklerin (3. Dünya Savaşı söylemleri) gölgesinde kaldı. Altın ve gümüşte sert düzeltmeler yaşansa da ('kar realizasyonu'), uzmanların çoğu bunun bir trend bitişi olmadığını, aksine fiziki kıtlık ve itibari para sistemine güvensizlik nedeniyle uzun vadeli boğa trendinin devam ettiğini vurguluyor. Kripto piyasası 'kumar masası' olarak görülürken, Borsa İstanbul siyasi belirsizliklerin kalkmasıyla tepki alımı gördü. ABD'de bölgesel banka krizleri ve Çin'in hamleleri küresel risk iştahını baskılamaya devam ediyor.",
      keyThemes: [
        "TCMB Faiz İndirimi",
        "Jeopolitik Riskler ve Savaş Söylemi",
        "Altın/Gümüşte Düzeltme ve Fiziki Kıtlık",
        "BIST'te Siyasi Belirsizliğin Kalkması",
        "Küresel Finansal Kriz Uyarıları",
      ],
    },
    sentimentAnalysis: [
      {
        asset: "Gram Altın",
        artuncKocabalkan: "Pozitif",
        elitFinans: "Pozitif",
        atillaYesilada: "Pozitif",
        cihatCicek: "Pozitif",
        islamMemis: "Pozitif",
        selcukGecer: "Pozitif",
        selcoin: "Pozitif",
        bloombergHT: "Veri Yok",
      },
      {
        asset: "Gümüş",
        artuncKocabalkan: "Veri Yok",
        elitFinans: "Nötr",
        atillaYesilada: "Veri Yok",
        cihatCicek: "Pozitif",
        islamMemis: "Pozitif",
        selcukGecer: "Veri Yok",
        selcoin: "Pozitif",
        bloombergHT: "Veri Yok",
      },
      {
        asset: "Dolar/TL",
        artuncKocabalkan: "Veri Yok",
        elitFinans: "Veri Yok",
        atillaYesilada: "Nötr",
        cihatCicek: "Veri Yok",
        islamMemis: "Nötr",
        selcukGecer: "Veri Yok",
        selcoin: "Veri Yok",
        bloombergHT: "Veri Yok",
      },
      {
        asset: "BIST 100",
        artuncKocabalkan: "Nötr",
        elitFinans: "Veri Yok",
        atillaYesilada: "Pozitif",
        cihatCicek: "Veri Yok",
        islamMemis: "Pozitif",
        selcukGecer: "Veri Yok",
        selcoin: "Negatif",
        bloombergHT: "Pozitif",
      },
      {
        asset: "Kripto",
        artuncKocabalkan: "Negatif",
        elitFinans: "Negatif",
        atillaYesilada: "Veri Yok",
        cihatCicek: "Veri Yok",
        islamMemis: "Pozitif",
        selcukGecer: "Pozitif",
        selcoin: "Pozitif",
        bloombergHT: "Veri Yok",
      },
    ],
    thematicGrouping: [
      {
        theme: "Makro ve Küresel Ekonomi",
        summaries: [
          {
            analyst: "Artunç Kocabalkan",
            quote: "Trend senin dostun olabilir, ama ona son binen olma.",
            videoId: "MJC1qn00hr0",
            timestamp: "26:35",
          }, // Updated
          {
            analyst: "Cihat E. Çiçek",
            quote:
              "Lehman gününden daha kötü durumdayız şu anda. (Trichet alıntısı)",
            videoId: "QcDxx1KwRI0",
            timestamp: "02:37",
          },
          {
            analyst: "Selçuk Geçer",
            quote:
              "3. Dünya Savaşı riski bile altını 6.000 doların üzerine taşımaya yeter.",
            videoId: "s-vpKZNfX9c",
            timestamp: "05:58",
          }, // Updated
          {
            analyst: "Atilla Yeşilada",
            quote:
              "Altınla hisse aynı anda yükseliyorsa korkarım; bu piyasa değil, balondur.",
            videoId: "-38luLFN3tl",
            timestamp: "10:15",
          },
          {
            analyst: "Elit Finans",
            quote:
              "3. Dünya Savaşı başladı; bu biyolojik ve ekonomik bir savaş.",
            videoId: "Azz25i3Xqio",
            timestamp: "1:24:24",
          },
          {
            analyst: "Atilla Yeşilada",
            quote: "Güçlü TL'den taviz yok.",
            videoId: "eSWkSXWme80",
            timestamp: "10:03",
          },
        ],
      },
      {
        theme: "Değerli Metaller",
        summaries: [
          {
            analyst: "Elit Finans",
            quote: "4060'ın üstünde başka bir dünya var.",
            videoId: "Azz25i3Xqio",
            timestamp: "08:02",
          },
          {
            analyst: "Selçuk Geçer",
            quote:
              "Altın 6.000$ hedefi - 'Savaş tamtamları çaldıkça altın uçar.'",
            videoId: "s-vpKZNfX9c",
            timestamp: "06:46",
          },
          {
            analyst: "Cihat E. Çiçek",
            quote:
              "Enflasyon, devletlerin borçlarını eritmek için kullandığı gündüz gözüyle soygundur; altın bunu fiyatlıyor.",
            videoId: "H74cg09-e_U",
            timestamp: "06:32",
          }, // Updated
          {
            analyst: "Artunç Kocabalkan",
            quote: "Altın değerlendirmesi: 4.200 görüldü, hedef 4.500.",
            videoId: "MJC1qn00hr0",
            timestamp: "02:12",
          },
          {
            analyst: "İslam Memiş",
            quote:
              "Ons altın 4.146$ - manipülasyon sürüyor. 3.800-4.200$ bandı korunuyor.",
            videoId: "DPPG06KtFs4",
            timestamp: "03:04",
          },
          {
            analyst: "Selcoin",
            quote:
              "Bu düşüş trend bitişi değil; kar realizasyonu. Altın 5300'lerde fırsat sunuyor.",
            videoId: "whsIQTy2Fg0",
            timestamp: "06:06",
          }, // Updated
          {
            analyst: "Elit Finans",
            quote:
              "Makas 600 TL; düşüşte bile fiziki altın vermiyorlar. Tepede satan, dipte yerine koyamıyor.",
            videoId: "QNeGB4Tgz60",
            timestamp: "08:46",
          }, // Updated
          {
            analyst: "Cihat E. Çiçek",
            quote:
              "Hindistan iddiası: 2026 Nisan'dan itibaren gümüşü rezerv/karşılık kabul + '1 altın = 10 gümüş' sabiti söylentisi.",
            videoId: "zqlcU55ylkU",
            timestamp: "21:35",
          },
          {
            analyst: "Cihat E. Çiçek",
            quote:
              "Hindistan'ın 1 günde 1000 ton gümüş, 50 ton altın aldığı iddiası; festival etkisi.",
            videoId: "QcDxx1KwRI0",
            timestamp: "06:18",
          },
          {
            analyst: "İslam Memiş",
            quote:
              "Gümüşte %50 kademeli alım stratejisi öneriliyor (49-47-42$).",
            videoId: "DPPG06KtFs4",
            timestamp: "07:40",
          },
          {
            analyst: "Selcoin",
            quote: "Top yekûn herkes altın alıyor; en çok da devlet.",
            videoId: "VJpoL_Ny3MY",
            timestamp: "04:04",
          }, // Updated
        ],
      },
      {
        theme: "Dolar/TL",
        summaries: [
          {
            analyst: "Atilla Yeşilada",
            quote:
              "Dolarizasyon değil bu, katılaşma. Çünkü Merkez Bankası'na değil, sisteme güven eksik.",
            videoId: "-38luLFN3tl",
            timestamp: "06:43",
          },
          {
            analyst: "İslam Memiş",
            quote: "Dolar 41,98 ay sonunda 42 TL görülür.",
            videoId: "DPPG06KtFs4",
            timestamp: "01:52",
          },
          {
            analyst: "Atilla Yeşilada",
            quote: "Hiçbir kuvvet Merkez Bankası'nın dövizde bileğini bükemez.",
            videoId: "eSWkSXWme80",
            timestamp: "16:22",
          },
        ],
      },
      {
        theme: "BIST100",
        summaries: [
          {
            analyst: "Bloomberg HT",
            quote:
              "2026'da banka ve holding hisseleri olumluyu satın alır; faiz düşüşü ve bilançolar bunu destekleyecek.",
            videoId: "bU8gdFD4g-A",
            timestamp: "12:16",
          },
          {
            analyst: "İslam Memiş",
            quote: "Borsa 10.800 puan kırılmadan güçlü değil.",
            videoId: "DPPG06KtFs4",
            timestamp: "01:21",
          },
          {
            analyst: "Artunç Kocabalkan",
            quote: "Borsada kısa vadeli fırsatlar, ama uzun vadede dikkat.",
            videoId: "MJC1qn00hr0",
            timestamp: "25:14",
          },
          {
            analyst: "Selcoin",
            quote: "Borsa İstanbul TL bazında dirençte, dolar bazında zayıf.",
            videoId: "whsIQTy2Fg0",
            timestamp: "10:32",
          },
        ],
      },
      {
        theme: "Kripto",
        summaries: [
          {
            analyst: "Selçuk Geçer",
            quote: "Fed faiz indirir, teknoloji ve kripto uçar.",
            videoId: "fUL6bo6U0Es",
            timestamp: "15:16",
          }, // Updated
          {
            analyst: "Elit Finans",
            quote:
              "Altcoin boğası bahanesiyle küçük yatırımcıyı içeri aldılar, sonra batırdılar.",
            videoId: "Azz25i3Xqio",
            timestamp: "1:03:18",
          },
          {
            analyst: "İslam Memiş",
            quote: "Bitcoin, dolar ve altına göre daha cazip.",
            videoId: "DPPG06KtFs4",
            timestamp: "10:05",
          },
          {
            analyst: "Artunç Kocabalkan",
            quote: "Bitcoin 107.000$; kritik destek 102.500$, hedef 114.000$.",
            videoId: "MJC1qn00hr0",
            timestamp: "10:37",
          },
          {
            analyst: "Selcoin",
            quote: "Bitcoin 113.500$'da tutunamazsa düzeltme sürecek.",
            videoId: "whsIQTy2Fg0",
            timestamp: "11:17",
          },
          {
            analyst: "Selçuk Geçer",
            quote:
              "ABD'nin dev bankaları yeni blok zinciri ve stabil coin ödeme sistemi üzerinde çalışıyor.",
            videoId: "fUL6bo6U0Es",
            timestamp: "13:58",
          },
        ],
      },
      {
        theme: "Yabancı Borsalar",
        summaries: [
          {
            analyst: "Artunç Kocabalkan",
            quote:
              "Nasdaq 'all time high' sonrası satışa geçti; dikkatli olunmalı.",
            videoId: "MJC1qn00hr0",
            timestamp: "07:44",
          },
          {
            analyst: "Elit Finans",
            quote: "Altında balon yok; balon Nasdaq ve S&P'de.",
            videoId: "Azz25i3Xqio",
            timestamp: "1:17:50",
          },
          {
            analyst: "Selçuk Geçer",
            quote:
              "Yapay zeka hisseleri (Nvidia, Microsoft, Google) yeni dalga.",
            videoId: "fUL6bo6U0Es",
            timestamp: "09:27",
          },
          {
            analyst: "Bloomberg HT",
            quote:
              "Avrupa'da PMI sürprizi, gayrimenkul zayıf, çip hisseleri güçlü.",
            videoId: "bU8gdFD4g-A",
            timestamp: "24:35",
          },
        ],
      },
    ],
  };

  // Analyst mapping for sentiment analysis
  const analystMapping = {
    selcukGecer: "Selçuk Geçer",
    islamMemis: "İslam Memiş",
    devrimAkyil: "Devrim Akyıl",
    artuncKocabalkan: "Artunç Kocabalkan",
    cihatCicek: "Cihat E. Çiçek",
    elitFinans: "Elit Finans",
    atillaYesilada: "Atilla Yeşilada",
    selcoin: "Selcoin",
    barisSoydan: "Barış Soydan",
    bloombergHT: "BloombergHT",
  };

  // Filter sentiment analysis based on followed channels
  const selectedAnalysts =
    followedChannels.length > 0
      ? followedChannels
          .map((channel) =>
            Object.keys(analystMapping).find(
              (key) => analystMapping[key] === channel
            )
          )
          .filter(Boolean)
      : Object.keys(analystMapping);

  const filteredSentimentAnalysis = reportData.sentimentAnalysis.map((row) => {
    const filteredRow = { asset: row.asset };
    selectedAnalysts.forEach((field) => {
      if (!row[field]) {
        filteredRow[field] = "Veri Yok";
      } else {
        filteredRow[field] = row[field];
      }
    });
    return filteredRow;
  });

  const filteredThematicGroups = useMemo(() => {
    return reportData.thematicGrouping
      .map((group) => ({
        ...group,
        summaries: group.summaries.filter(
          (summary) =>
            followedChannels.length === 0 ||
            followedChannels
              .map((c) => c.toLowerCase())
              .includes(summary.analyst.toLowerCase())
        ),
      }))
      .filter((group) => group.summaries.length > 0); // Boş group'ları atla
  }, [reportData.thematicGrouping, followedChannels]);

  console.log("Filtered analysts:", selectedAnalysts);
  console.log("Filtered thematic groups:", filteredThematicGroups);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Haftalık Finans Raporu
          </h1>
          <p className="text-xl text-gray-400 mt-2">{reportData.weekOf}</p>
          <p className="text-xs text-gray-300 max-w-3xl mx-auto">
            Bu platformda bulunan bilgiler yatırım danışmanlığı kapsamında
            olmadığı gibi yatırım tavsiyesi değildir. Yapılan özetler bireysel
            görüşlerimdir. Videoların tamamını izlemeniz önerilir.
          </p>
        </header>

        {/* Big Picture Section */}
        <section id="big-picture" className="mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-center mb-4">
              <LightbulbIcon />
              <h2 className="text-3xl font-bold ml-4 text-yellow-300">
                Haftanın &ldquo;Büyük Resmi&rdquo;
              </h2>
            </div>
            <p className="text-lg text-gray-300 mb-6">
              {reportData.bigPictureSummary.summary}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="font-semibold mr-2">Öne Çıkan Temalar:</span>
              {reportData.bigPictureSummary.keyThemes.map((theme, index) => (
                <span
                  key={index}
                  className="bg-blue-900/50 text-blue-300 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Sentiment Analysis Section */}
        {followedChannels.length > 0 && (
          <section id="sentiment-analysis" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Uzman Görüşü: Duygu Analizi
            </h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-400">
                Seçili {selectedAnalysts.length} analist gösteriliyor
              </span>
            </div>
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Varlık
                    </th>
                    {selectedAnalysts.map((field) => (
                      <th
                        key={field}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                      >
                        {analystMapping[field].split(" ")[0]}{" "}
                        {/* İlk kelime: S. Geçer gibi */}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredSentimentAnalysis.map((item, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-gray-700/40 transition-colors duration-200"
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-white">
                        {item.asset}
                      </td>
                      {selectedAnalysts.map((field) => (
                        <SentimentCell key={field} sentiment={item[field]} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedAnalysts.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                Seçili kanal yok – tüm tablo gösteriliyor.
              </p>
            )}
          </section>
        )}

        {/* Thematic Analysis Section */}
        {followedChannels.length > 0 && (
          <section id="thematic-grouping">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Tematik Analizler
            </h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-400">
                Seçili {followedChannels.length} kanal bazında filtrelendi (
                {filteredThematicGroups.reduce(
                  (total, g) => total + g.summaries.length,
                  0
                )}{" "}
                içerik)
              </span>
            </div>
            <div className="space-y-10">
              {filteredThematicGroups.map((group) => (
                <div key={group.theme}>
                  <h3 className="text-2xl font-semibold mb-5 pb-2 border-b-2 border-gray-700 text-cyan-400">
                    {group.theme}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {group.summaries.map((summary, index) => (
                      <SummaryCard key={index} summary={summary} />
                    ))}
                  </div>
                </div>
              ))}
              {filteredThematicGroups.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <p className="text-gray-400 text-center py-8 col-span-full">
                    Seçili kanallar için tematik içerik yok. Daha fazla kanal
                    seçin.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
