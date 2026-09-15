import React, { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { SettingsModal } from "./components/SettingsModal";
import { CharacterWorkbench } from "./components/CharacterWorkbench";
import { VideoGenerator } from "./components/VideoGenerator";
import { AudioBeatStudio } from "./components/AudioBeatStudio";
import { VideoPreviewPlayer } from "./components/VideoPreviewPlayer";
import { TimelineEditor } from "./components/TimelineEditor";
import { StoryboardStudio } from "./components/StoryboardStudio";
import { ExportModal } from "./components/ExportModal";
import {
  VideoClip,
  CharacterProfile,
  AudioTrackItem,
  BeatMarker,
  ApiConfig,
  AspectRatio,
  TransitionType,
} from "./types";
import { AgnesApiService } from "./services/agnesApi";
import { beatEngine } from "./services/audioAnalyzer";
import { VideoCompositeRenderer } from "./services/videoRenderer";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"storyboard" | "character" | "generate" | "audio">("storyboard");

  // API Config
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    agnesApiKey: "",
    agnesBaseUrl: "https://apihub.agnes-ai.com/v1",
    isAgnesConfigured: false,
    isGeminiConfigured: true,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Character Reference & Consistency Profile
  const [characterProfile, setCharacterProfile] = useState<CharacterProfile>({
    referenceImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    outfit:
      "traditional Vietnamese silk Áo Dài with intricate gold lotus embroidery and flowing silk trousers",
    expression: "confident alluring smile, sharp engaging eyes, subtle relaxed dimples",
    expressionIntensity: 85,
    preserveFaceDetail: true,
  });

  // Timeline Clips
  const [clips, setClips] = useState<VideoClip[]>([
    {
      id: "clip_sample_1",
      title: "Cảnh 1: Nhân Vật - Áo Dài Lụa Phố Cổ",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      duration: 4.5,
      prompt:
        "Nhân vật nữ mặc Áo Dài lụa truyền thống dạo bước phố cổ Hội An, nắng vàng chiếu nghiêng, nụ cười tự tin 8k cinematic.",
      model: "agnes-video-v2.0",
      characterProfile: {
        referenceImage:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
        outfit: "traditional Vietnamese silk Áo Dài with intricate gold lotus embroidery",
        expression: "confident alluring smile",
        expressionIntensity: 85,
        preserveFaceDetail: true,
      },
      transitionToNext: {
        type: "zoom_in",
        duration: 0.6,
      },
    },
    {
      id: "clip_sample_2",
      title: "Cảnh 2: Biến Đổi Cyberpunk Neon",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
      duration: 4.5,
      prompt:
        "Khuôn mặt nhân vật giữ nguyên độ nét, thay đổi sang trang phục Cyberpunk trenchcoat phát sáng neon trên phố mưa Tokyo.",
      model: "agnes-video-v2.0",
      characterProfile: {
        referenceImage:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
        outfit: "high-tech cyberpunk neon glowing trenchcoat with reflective carbon fiber",
        expression: "intense cinematic dramatic gaze",
        expressionIntensity: 90,
        preserveFaceDetail: true,
      },
      transitionToNext: {
        type: "flash_white",
        duration: 0.5,
      },
    },
    {
      id: "clip_sample_3",
      title: "Cảnh 3: Dạ Hội Luxury & Đèn Pha Lê",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
      duration: 5.0,
      prompt:
        "Nhân vật diện đầm dạ tiệc đen sang trọng bước xuống sảnh lớn, ánh nhìn kiêu kỳ, camera lướt nhẹ góc 35mm.",
      model: "agnes-video-v2.0",
      characterProfile: {
        referenceImage:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
        outfit: "luxurious midnight-black haute couture velvet evening gown",
        expression: "mysterious subtle smirk",
        expressionIntensity: 75,
        preserveFaceDetail: true,
      },
    },
  ]);

  // Audio & Beat Sync
  const [audioTracks, setAudioTracks] = useState<AudioTrackItem[]>([
    {
      id: "track_1",
      title: "Cyberpunk Pulse Drive",
      artist: "Neon Beats",
      genre: "Synthwave / EDM",
      bpm: 128,
      duration: 32,
      url: "https://cdn.freesound.org/previews/588/588234_11861866-lq.mp3",
    },
    {
      id: "track_2",
      title: "Trap Momentum Beat",
      artist: "Urban Flow",
      genre: "Trap / Hiphop",
      bpm: 140,
      duration: 28,
      url: "https://cdn.freesound.org/previews/612/612662_11861866-lq.mp3",
    },
    {
      id: "track_3",
      title: "Chill Lo-Fi Sunset",
      artist: "Velvet Waves",
      genre: "Lo-Fi / Cinematic",
      bpm: 85,
      duration: 40,
      url: "https://cdn.freesound.org/previews/568/568853_11861866-lq.mp3",
    },
  ]);
  const [selectedTrack, setSelectedTrack] = useState<AudioTrackItem | null>(audioTracks[0]);
  const [beatMarkers, setBeatMarkers] = useState<BeatMarker[]>([]);

  // Video Player & Aspect Ratio
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playheadIntervalRef = useRef<number | null>(null);

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState("");
  const [isExportCompleted, setIsExportCompleted] = useState(false);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  // Total Duration calculation
  const totalDuration = clips.reduce((sum, c) => sum + c.duration, 0);

  // Initial health check and track setup
  useEffect(() => {
    AgnesApiService.checkHealth().then((health) => {
      setApiConfig((prev) => ({
        ...prev,
        isAgnesConfigured: health.hasAgnesKey,
        isGeminiConfigured: health.hasGeminiKey,
      }));
    });

    // Load initial track into audio engine and detect beats
    if (selectedTrack) {
      beatEngine.loadTrack(selectedTrack.url);
      beatEngine.analyzeBeatsFromBuffer(selectedTrack.url, selectedTrack.bpm).then((res) => {
        setBeatMarkers(res.beats);
      });
    }
  }, []);

  // Synchronized Playback Loop
  useEffect(() => {
    if (isPlaying) {
      beatEngine.play(currentTime);
      const stepMs = 50;
      playheadIntervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + stepMs / 1000;
          if (next >= totalDuration) {
            // Loop or stop
            beatEngine.seek(0);
            return 0;
          }
          return next;
        });
      }, stepMs);
    } else {
      beatEngine.pause();
      if (playheadIntervalRef.current) {
        clearInterval(playheadIntervalRef.current);
      }
    }

    return () => {
      if (playheadIntervalRef.current) {
        clearInterval(playheadIntervalRef.current);
      }
    };
  }, [isPlaying, totalDuration]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    beatEngine.seek(time);
  };

  // Timeline operations
  const handleUpdateClip = (index: number, updated: Partial<VideoClip>) => {
    setClips((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updated };
      return next;
    });
  };

  const handleDeleteClip = (index: number) => {
    setClips((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDuplicateClip = (index: number) => {
    setClips((prev) => {
      const item = prev[index];
      const dup: VideoClip = {
        ...item,
        id: "clip_" + Date.now(),
        title: item.title + " (Bản sao)",
      };
      const next = [...prev];
      next.splice(index + 1, 0, dup);
      return next;
    });
  };

  const handleUpdateTransition = (index: number, type: TransitionType, duration: number) => {
    setClips((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        transitionToNext: { type, duration },
      };
      return next;
    });
  };

  const handleAddSampleClip = () => {
    const newClip: VideoClip = {
      id: "clip_custom_" + Date.now(),
      title: `Cảnh Mới: ${characterProfile.outfit ? characterProfile.outfit.slice(0, 24) : "Nhân vật điện ảnh"}`,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl:
        characterProfile.referenceImage ||
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
      duration: 5.0,
      prompt: `Nhân vật tham chiếu diện ${characterProfile.outfit}, biểu cảm ${characterProfile.expression}`,
      model: "agnes-video-v2.0",
      characterProfile,
      transitionToNext: {
        type: "crossfade",
        duration: 0.6,
      },
    };
    setClips((prev) => [...prev, newClip]);
  };

  // Generation from Character Workbench
  const handleGenerateCharacterScene = (char: CharacterProfile) => {
    setActiveTab("generate");
  };

  const handleSelectVariantForVideo = (variant: any) => {
    setCharacterProfile((prev) => ({
      ...prev,
      referenceImage: variant.imageUrl,
      enhancedImage: variant.imageUrl,
      outfit: variant.outfit || prev.outfit,
      expression: variant.expression || prev.expression,
    }));
    setActiveTab("generate");
  };

  // Render & Export Handler
  const handleExport = async () => {
    setIsPlaying(false);
    setIsExportModalOpen(true);
    setIsExportCompleted(false);
    setExportProgress(0);
    setExportStatusText("Đang khởi tạo canvas engine kết xuất video...");

    try {
      const blob = await VideoCompositeRenderer.renderAndExport(
        clips,
        selectedTrack?.url,
        (prog, text) => {
          setExportProgress(prog);
          setExportStatusText(text);
        }
      );

      const url = URL.createObjectURL(blob);
      setExportedBlob(blob);
      setExportedUrl(url);
      setIsExportCompleted(true);
    } catch (err: any) {
      setExportStatusText(`Lỗi kết xuất: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        apiConfig={apiConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportClick={handleExport}
        isExporting={isExportModalOpen && !isExportCompleted}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clipCount={clips.length}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Top Grid: Left Studio Tabs & Right Player Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Workbench Tabs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {activeTab === "storyboard" && (
              <StoryboardStudio
                characterProfile={characterProfile}
                onChangeProfile={(updated) => setCharacterProfile((prev) => ({ ...prev, ...updated }))}
                onSendToTimeline={(newClips) => {
                  setClips(newClips);
                }}
                apiConfig={apiConfig}
              />
            )}

            {activeTab === "character" && (
              <CharacterWorkbench
                characterProfile={characterProfile}
                onChangeProfile={(updated) => setCharacterProfile((prev) => ({ ...prev, ...updated }))}
                onGenerateScene={handleGenerateCharacterScene}
                isGenerating={false}
                apiConfig={{
                  agnesApiKey: apiConfig.agnesApiKey,
                  agnesBaseUrl: apiConfig.agnesBaseUrl,
                  isAgnesConfigured: apiConfig.isAgnesConfigured,
                }}
                onSelectVariantForVideo={handleSelectVariantForVideo}
              />
            )}

            {activeTab === "generate" && (
              <VideoGenerator
                characterProfile={characterProfile}
                onClipCreated={(newClip) => {
                  setClips((prev) => [
                    ...prev,
                    {
                      ...newClip,
                      transitionToNext: { type: "crossfade", duration: 0.6 },
                    },
                  ]);
                }}
                apiConfig={{
                  agnesApiKey: apiConfig.agnesApiKey,
                  agnesBaseUrl: apiConfig.agnesBaseUrl,
                  isAgnesConfigured: apiConfig.isAgnesConfigured,
                }}
              />
            )}

            {activeTab === "audio" && (
              <AudioBeatStudio
                tracks={audioTracks}
                selectedTrack={selectedTrack}
                onSelectTrack={(t) => {
                  setSelectedTrack(t);
                  beatEngine.analyzeBeatsFromBuffer(t.url, t.bpm).then((res) => {
                    setBeatMarkers(res.beats);
                  });
                }}
                beatMarkers={beatMarkers}
                onAutoSyncBeats={(syncedClips) => setClips(syncedClips)}
                currentClips={clips}
                onUploadCustomTrack={(t) => setAudioTracks((prev) => [t, ...prev])}
              />
            )}
          </div>

          {/* Right Column: Video Preview Player (5 cols) */}
          <div className="lg:col-span-5 sticky top-20">
            <VideoPreviewPlayer
              clips={clips}
              currentTime={currentTime}
              totalDuration={totalDuration}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onSeek={handleSeek}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              audioUrl={selectedTrack?.url}
            />
          </div>
        </div>

        {/* Bottom: Multi-Track Timeline & Beat Visualizer */}
        <TimelineEditor
          clips={clips}
          currentTime={currentTime}
          totalDuration={totalDuration}
          onSeek={handleSeek}
          onUpdateClip={handleUpdateClip}
          onDeleteClip={handleDeleteClip}
          onDuplicateClip={handleDuplicateClip}
          onUpdateTransition={handleUpdateTransition}
          beatMarkers={beatMarkers}
          onAddSampleClip={handleAddSampleClip}
        />
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={apiConfig}
        onSaveConfig={(updated) => setApiConfig((prev) => ({ ...prev, ...updated }))}
      />

      {/* Export Progress & Download Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        progress={exportProgress}
        statusText={exportStatusText}
        isCompleted={isExportCompleted}
        exportedBlob={exportedBlob}
        exportedUrl={exportedUrl}
      />
    </div>
  );
}
