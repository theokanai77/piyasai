"use client";

import { useState } from "react";

export default function FinAlAnalytics({ channels = [], videos = [] }) {
  const [activeTab, setActiveTab] = useState("video-summaries");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpert, setSelectedExpert] = useState("all");
  const [selectedChannelId, setSelectedChannelId] = useState("all");
  const [expandedVideos, setExpandedVideos] = useState(new Set());
  const [expandedSummaries, setExpandedSummaries] = useState(new Set());

  // Filter videos based on search term and selected channel
  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChannel =
      selectedChannelId === "all" || video.channel === selectedChannelId;

    return matchesSearch && matchesChannel;
  });

  // Filter channels based on search term
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dynamic stats
  const totalVideos = videos.length;
  const totalChannels = channels.length;
  const totalTimestamps = videos.reduce((total, video) => {
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
              <a
                href="/tematik.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <span className="mr-2">📊</span>
                Tematik Analiz
              </a>
            </div>

            {/* Badge */}
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
              <span className="text-green-400">📈</span>
              <span className="text-sm text-white">
                Bu Hafta: {totalVideos} Video
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* AI Destekli Video Analizleri Section */}
        <section className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-orange-500">⚡</span> AI Destekli Video
              Analizleri
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Finansal uzmanların görüşlerini yapay zeka ile analiz edip,{" "}
              <span className="text-orange-500 font-semibold">
                kullanılabilir zaman damgalarıyla
              </span>{" "}
              sunan platform
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-4xl font-bold text-white mb-2">
                {totalVideos}
              </div>
              <div className="text-gray-400">Video Analizi</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-4xl font-bold text-white mb-2">
                {totalChannels}
              </div>
              <div className="text-gray-400">
                <span className="text-green-400">Uzm. Büyücü</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-4xl font-bold text-white mb-2">
                {totalTimestamps}+
              </div>
              <div className="text-gray-400">
                <span className="text-blue-400">Zaman Damgası</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Video başlığı veya uzman adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedExpert}
              onChange={(e) => setSelectedExpert(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">Tüm Uzmanlar</option>
              {channels.map((channel, index) => (
                <option key={index} value={channel.name}>
                  {channel.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Channel Cards */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Kanal Listesi</h2>
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
                <h3 className="font-bold text-white mb-2">Tüm Kanallar</h3>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <span>▷ {totalVideos} video</span>
                  <span>•</span>
                  <span className="text-green-400">Aktif</span>
                </div>
              </div>
            </div>

            {/* Individual Channel Cards */}
            {filteredChannels.map((channel, index) => (
              <div
                key={index}
                onClick={() => handleChannelClick(channel.name)}
                className={`rounded-lg p-6 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 cursor-pointer ${
                  selectedChannelId === channel.name
                    ? "bg-orange-800 ring-2 ring-orange-400"
                    : "bg-gray-800"
                }`}
              >
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
                  <h3 className="font-bold text-white mb-2">{channel.name}</h3>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <span>▷ {channel.videoCount} video</span>
                    <span>•</span>
                    <span
                      className={
                        channel.isActive ? "text-green-400" : "text-gray-400"
                      }
                    >
                      {channel.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tüm Videolar Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Tüm Videolar</h2>
            <span className="bg-gray-800 rounded-lg px-3 py-1 text-sm text-gray-400">
              {filteredVideos.length} video bulundu
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredVideos.map((video, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-start space-x-4 mb-4">
                  <button
                    onClick={() => handleYouTubeClick(video.videoUrl)}
                    className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <span className="text-white text-lg">▷</span>
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-white">{video.channel}</h3>
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
                        <span>{video.timestamps.length} zaman damgası</span>
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
                    <span>{expandedSummaries.has(index) ? "↑" : "↓"}</span>
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
                    Kilit Zaman Damgaları:
                  </h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {(expandedVideos.has(index)
                      ? video.timestamps
                      : video.timestamps.slice(0, 3)
                    ).map((timestamp, tsIndex) => (
                      <div key={tsIndex} className="text-sm">
                        <button
                          onClick={() =>
                            handleTimestampClick(video.videoUrl, timestamp.time)
                          }
                          className="text-blue-400 hover:text-blue-300 hover:underline font-medium mr-2"
                        >
                          {timestamp.time}
                        </button>
                        <span className="text-gray-400">{timestamp.text}</span>
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
                            } daha fazla zaman damgası...`}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-4">
        <div className="container mx-auto px-4 flex justify-end">
          <div className="bg-gray-800 rounded-lg px-3 py-1 text-sm text-gray-400">
            <span className="mr-2">b</span>
            Made in Bolt
          </div>
        </div>
      </footer>
    </div>
  );
}
