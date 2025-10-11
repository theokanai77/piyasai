"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";

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

const formatDate = (dateString) => {
  if (!dateString) return "Tarih bilgisi yok";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  } catch (error) {
    return "Tarih bilgisi yok";
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
  const [activeTab, setActiveTab] = useState("video-summaries");
  const [searchTerm] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState("all");
  const [expandedVideos, setExpandedVideos] = useState(new Set());
  const [expandedSummaries, setExpandedSummaries] = useState(new Set());
  const [followedChannels, setFollowedChannels] = useState([]);
  const [loadingFollow, setLoadingFollow] = useState(false);

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
  const statsTotalVideos = videos.length;
  const statsTotalChannels = channels.length;
  const statsTotalTimestamps = videos.reduce((total, video) => {
    return total + (video.timestamps ? video.timestamps.length : 0);
  }, 0);

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
                  Uzman Görüşleri & Analiz
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
                Varlıklar
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* All Channels Card */}
                <div
                  onClick={() => handleChannelClick("all")}
                  className={`rounded-lg p-6 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 cursor-pointer ${
                    selectedChannelId === "all"
                      ? "bg-orange-800 ring-2 ring-orange-400"
                      : "bg-gray-800"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-600">
                      <span className="text-white text-xl">📺</span>
                    </div>
                    <h3 className="font-bold text-white mb-2">
                      Tüm Takip Edilen Kanallar
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
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
                      className={`group relative rounded-lg p-6 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 ${
                        selectedChannelId === channel.name
                          ? "bg-orange-800 ring-2 ring-orange-400"
                          : "bg-gray-800"
                      }`}
                    >
                      {/* Toggle Button - Top Right Corner */}
                      {session?.user?.id && (
                        <button
                          onClick={() => handleToggle(channel.name)}
                          className={`absolute top-2 right-2 rounded-full p-1 hover:scale-110 transition opacity-0 group-hover:opacity-100 ${
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
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                            channel.avatarColor === "blue"
                              ? "bg-blue-500"
                              : channel.avatarColor === "green"
                              ? "bg-green-500"
                              : channel.avatarColor === "purple"
                              ? "bg-purple-500"
                              : "bg-orange-500"
                          }`}
                        >
                          <span className="text-white text-xl">👤</span>
                        </div>
                        <h3 className="font-bold text-white mb-2">
                          {channel.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-3">
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
                            Videoları Gör
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
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                            <span className="flex items-center space-x-1">
                              <span>🕐</span>
                              <span>
                                {video.timestamps.length} zaman damgası
                              </span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>📅</span>
                              <span>{formatDate(video.publishDate)}</span>
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
    weekOf: "11 Ekim 2025 Haftası",
    bigPictureSummary: {
      summary:
        "Bu hafta uzmanlar, kağıt piyasalarına karşı artan güvensizlik ve fiziki varlıklara (altın, gümüş) olan talebin altını çiziyor. Zayıflayan ABD ekonomik verileri, Fed'in faiz indirimi beklentilerini güçlendirerek piyasalarda volatilite yaratıyor. Altın, kısa vadeli bir düzeltme sürecinde olsa da, jeopolitik riskler ve merkez bankalarının talebiyle uzun vadeli yükseliş trendini koruyor. Türkiye özelinde ise Halkbank davası gibi siyasi riskler ve mevcut ekonomik politikalar, yatırımcıları Borsa İstanbul ve TL konusunda temkinli olmaya itiyor. Genel kanı, 'sistemin kazandığı, yatırımcının dikkatli olması gereken' bir döneme girildiği yönünde.",
      keyThemes: [
        "Fiziki Varlıklara Yöneliş",
        "ABD Verileri ve Fed Beklentileri",
        "Altında Kısa Vadeli Düzeltme",
        "Türkiye'ye Özgü Politik Riskler",
        "Piyasalarda Volatilite Artışı",
      ],
    },
    sentimentAnalysis: [
      {
        asset: "Gram Altın",
        devrimAkyil: "Pozitif",
        islamMemis: "Negatif",
        artuncKocabalkan: "Pozitif",
        cihatCicek: "Pozitif",
        elitFinans: "Pozitif",
        atillaYesilada: "Pozitif",
      },
      {
        asset: "Gümüş",
        devrimAkyil: "Pozitif",
        islamMemis: "Negatif",
        artuncKocabalkan: "Pozitif",
        cihatCicek: "Pozitif",
        elitFinans: "Pozitif",
        atillaYesilada: "Veri Yok",
      },
      {
        asset: "Dolar/TL",
        devrimAkyil: "Pozitif",
        islamMemis: "Pozitif",
        artuncKocabalkan: "Pozitif",
        cihatCicek: "Pozitif",
        elitFinans: "Nötr",
        atillaYesilada: "Negatif",
      },
      {
        asset: "BIST 100",
        devrimAkyil: "Negatif",
        islamMemis: "Pozitif",
        artuncKocabalkan: "Negatif",
        cihatCicek: "Nötr",
        elitFinans: "Pozitif",
        atillaYesilada: "Veri Yok",
      },
      {
        asset: "Kripto",
        devrimAkyil: "Veri Yok",
        islamMemis: "Pozitif",
        artuncKocabalkan: "Pozitif",
        cihatCicek: "Negatif",
        elitFinans: "Negatif",
        atillaYesilada: "Veri Yok",
      },
    ],
    thematicGrouping: [
      {
        theme: "Küresel Ekonomi",
        summaries: [
          {
            analyst: "Bloomberg HT",
            quote:
              "Finansal piyasalar için asıl kritik olan konu Fed bilançosudur. Faiz indirimi para basmak demek değildir.",
            videoId: "zhcsjGZOMmA",
            timestamp: "11:09",
          },
          {
            analyst: "Artunç Kocabalkan",
            quote:
              "İstihdam verisi sert düştü, resesyon sinyali verdi; Fed'in ekim ayında faiz indirimi olasılığı kesinleşti.",
            videoId: "XW7UmbWal40",
            timestamp: "01:31",
          },
          {
            analyst: "Elit Finans",
            quote:
              "ABD'de işletmelerin %80'i batık, faiz indirimi balon yaratıyor.",
            videoId: "jXjqr256nBE",
            timestamp: "50:11",
          },
          {
            analyst: "Cihat E. Çiçek",
            quote:
              "Yangında herkes eline ne geçerse atar nakit sıkışıklığında iyi varlıklar bile satılır.",
            videoId: "nHn_v2PWnr4",
            timestamp: "00:00",
          }, // Timestamp matches "Günün Sözü"
        ],
      },
      {
        theme: "Türkiye Ekonomisi",
        summaries: [
          {
            analyst: "Devrim Akyıl",
            quote:
              "Kur yanlış yerde durduğu sürece her türlü hamle yanlış sonuçlanacak.",
            videoId: "ZlppMl2hNZk",
            timestamp: "00:00",
          }, // Timestamp matches "Kilit Tespit"
          {
            analyst: "Atilla Yeşilada",
            quote: "Hiçbir şey olmaz. TL'den kaçan pişman olur!",
            videoId: "rQnfjQvxQSE",
            timestamp: "00:00",
          }, // Timestamp matches "Günün Sözü"
          {
            analyst: "Artunç Kocabalkan",
            quote:
              "Halkbank davasının 'Demokles'in kılıcı' gibi Türkiye'nin üzerinde sallandığını söylüyor.",
            videoId: "CaAukqMymgE",
            timestamp: "08:36",
          },
          {
            analyst: "Atilla Yeşilada",
            quote:
              "Sanayi göçü: Şirketler Mısır'a taşınıyor - nedenleri düşük maliyet ve Türkiye'deki hukuki belirsizlik.",
            videoId: "rQnfjQvxQSE",
            timestamp: "09:58",
          },
        ],
      },
      {
        theme: "Değerli Metaller",
        summaries: [
          {
            analyst: "Cihat E. Çiçek",
            quote:
              "Kağıt bol, altın yok. O yüzden paranızı kağıtta değil, elinizde tutun.",
            videoId: "OVPW232Eh68",
            timestamp: "00:00",
          }, // Timestamp for Günün Sözü
          {
            analyst: "Artunç Kocabalkan",
            quote: "Altındaki her düşüş bir alım fırsatıdır.",
            videoId: "CaAukqMymgE",
            timestamp: "00:00",
          }, // Timestamp for Kilit Tespit
          {
            analyst: "İslam Memiş",
            quote:
              "2026 hedefleri: ons altın 4.250 dolar, gram altın 6.500 TL.",
            videoId: "NYSLIYDCubM",
            timestamp: "02:34",
          },
          {
            analyst: "Elit Finans",
            quote: "Gram altın yıl sonu hedefi 5400 TL.",
            videoId: "jXjqr256nBE",
            timestamp: "56:41",
          },
          {
            analyst: "Cihat E. Çiçek",
            quote:
              "Türkiye'de gümüş stoklarının tükendiğini, rafinerilerde 'yakında stokta' uyarılarının arttığını bildiriyor.",
            videoId: "OVPW232Eh68",
            timestamp: "11:16",
          },
          {
            analyst: "Devrim Akyıl",
            quote: "Gümüşteki hareket çok gerçek; arz-talep dengesizliği var.",
            videoId: "ZlppMl2hNZk",
            timestamp: "14:58",
          },
        ],
      },
      {
        theme: "Dolar/TL",
        summaries: [
          {
            analyst: "Devrim Akyıl",
            quote:
              "Bu kurla devam edilmeyeceği net. Geciktikçe daha yüksek kur gerekir.",
            videoId: "ZlppMl2hNZk",
            timestamp: "10:48",
          },
          {
            analyst: "İslam Memiş",
            quote: "Dolar/TL 41,82; yıl sonu hedefi 43,80 - 45 aralığında.",
            videoId: "NYSLIYDCubM",
            timestamp: "09:57",
          },
          {
            analyst: "Atilla Yeşilada",
            quote:
              "Faiz indirimi eleştirisi: Döviz krizi beklemiyor ama faiz düşüşlerinin enflasyonu azdıracağı uyarısı yapıyor.",
            videoId: "rQnfjQvxQSE",
            timestamp: "03:57",
          },
        ],
      },
      {
        theme: "BIST100",
        summaries: [
          {
            analyst: "Artunç Kocabalkan",
            quote: "Borsadan bir cacık olmaz.",
            videoId: "CaAukqMymgE",
            timestamp: "05:52",
          },
          {
            analyst: "Devrim Akyıl",
            quote:
              "BIST'te 10.844 altı riskli bölge; döviz rahatlamazsa baskı sürecek.",
            videoId: "ZlppMl2hNZk",
            timestamp: "16:37",
          },
          {
            analyst: "İslam Memiş",
            quote: "Borsa İstanbul 10.746; ucuz ve 11.800 hedefi korunuyor.",
            videoId: "NYSLIYDCubM",
            timestamp: "10:19",
          },
        ],
      },
      {
        theme: "Kripto",
        summaries: [
          {
            analyst: "İslam Memiş",
            quote:
              "Bitcoin pozisyonu yıl sonuna kadar korunacak; fiyat hedefi 135.000 dolar.",
            videoId: "NYSLIYDCubM",
            timestamp: "03:35",
          },
          {
            analyst: "Elit Finans",
            quote:
              "Bitcoin'de negatif uyumsuzluk tespiti - büyük oyuncular satıyor.",
            videoId: "jXjqr256nBE",
            timestamp: "12:27",
          },
          {
            analyst: "Artunç Kocabalkan",
            quote:
              "Bitcoin 117.500 üzerine çıkarsa tüm zamanların zirvesi hareketi başlayabilir.",
            videoId: "XW7UmbWal40",
            timestamp: "13:35",
          },
        ],
      },
      {
        theme: "Yabancı Borsalar",
        summaries: [
          {
            analyst: "Cihat E. Çiçek",
            quote:
              "Nasdaq -%3,5; krediyle taşınan pozisyonların çözülmesi ve teminat baskısı.",
            videoId: "nHn_v2PWnr4",
            timestamp: "10:00",
          },
          {
            analyst: "Bloomberg HT",
            quote:
              "Avrupa'da otomotiv hisseleri sert düşüşte; Ferrari rehberlik hayal kırıklığı sonrası negatif ayrışıyor.",
            videoId: "zhcsjGZOMmA",
            timestamp: "04:21",
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
    elitfinans: "Elit Finans",
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
              <button
                onClick={() => {
                  /* Tümünü göster logic, ama şimdilik pass */
                }}
                className="text-blue-400 hover:underline text-sm"
              >
                Tümünü Göster
              </button>
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
              <button
                onClick={() => {
                  /* Tümünü göster, pass */
                }}
                className="text-blue-400 hover:underline text-sm"
              >
                Tümünü Göster
              </button>
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
