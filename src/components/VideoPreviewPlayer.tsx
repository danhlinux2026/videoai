import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Smartphone,
  Tv,
  Sparkles,
  Zap,
} from "lucide-react";
import { VideoClip, AspectRatio, TransitionType } from "../types";
import { beatEngine } from "../services/audioAnalyzer";

interface VideoPreviewPlayerProps {
  clips: VideoClip[];
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  audioUrl?: string;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  clips,
  currentTime,
  totalDuration,
  isPlaying,
  onTogglePlay,
  onSeek,
  aspectRatio,
  onAspectRatioChange,
  audioUrl,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [activeTransition, setActiveTransition] = useState<{ type: TransitionType; progress: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);

  // Determine current active clip and time within clip
  let accumulatedTime = 0;
  let activeIndex = 0;
  let localTime = 0;

  for (let i = 0; i < clips.length; i++) {
    if (currentTime >= accumulatedTime && currentTime < accumulatedTime + clips[i].duration) {
      activeIndex = i;
      localTime = currentTime - accumulatedTime;
      break;
    }
    accumulatedTime += clips[i].duration;
    if (i === clips.length - 1) {
      activeIndex = i;
      localTime = clips[i].duration;
    }
  }

  const currentClip = clips[activeIndex];
  const nextClip = clips[activeIndex + 1];
  const transition = currentClip?.transitionToNext;
  const transitionDuration = transition?.duration || 0.6;
  const timeUntilClipEnd = currentClip ? currentClip.duration - localTime : 0;

  // Check if active playback is inside the transition window
  useEffect(() => {
    if (transition && transition.type !== "none" && timeUntilClipEnd <= transitionDuration && nextClip) {
      const prog = 1 - timeUntilClipEnd / transitionDuration;
      setActiveTransition({ type: transition.type, progress: prog });
    } else {
      setActiveTransition(null);
    }
  }, [currentTime, timeUntilClipEnd, transition, transitionDuration, nextClip]);

  // Sync video element time
  useEffect(() => {
    if (videoRef.current && currentClip) {
      const targetTime = localTime % (videoRef.current.duration || currentClip.duration);
      if (Math.abs(videoRef.current.currentTime - targetTime) > 0.3) {
        videoRef.current.currentTime = targetTime;
      }
      if (isPlaying && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      } else if (!isPlaying && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  }, [currentClip, localTime, isPlaying]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl flex flex-col items-center">
      {/* Top bar controls */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-slate-200">
            {currentClip ? currentClip.title : "Trống - Hãy thêm clip"}
          </span>
          {activeTransition && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 flex items-center gap-1 animate-pulse">
              <Zap className="w-3 h-3 text-cyan-400" />
              Chuyển cảnh: {activeTransition.type.replace("_", " ")}
            </span>
          )}
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onAspectRatioChange("9:16")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              aspectRatio === "9:16"
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Dọc (TikTok, Shorts, Reels)"
          >
            <Smartphone className="w-3 h-3" />
            9:16 Dọc
          </button>
          <button
            onClick={() => onAspectRatioChange("16:9")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              aspectRatio === "16:9"
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Ngang (YouTube, Cinema)"
          >
            <Tv className="w-3 h-3" />
            16:9 Ngang
          </button>
        </div>
      </div>

      {/* Screen Frame Container */}
      <div
        className={`relative bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center justify-center transition-all duration-300 ${
          aspectRatio === "9:16"
            ? "w-[280px] sm:w-[320px] h-[500px] sm:h-[560px]"
            : "w-full max-w-[560px] aspect-video"
        }`}
      >
        {currentClip ? (
          <>
            {/* Primary Video Element */}
            <video
              ref={videoRef}
              src={currentClip.videoUrl}
              poster={currentClip.thumbnailUrl}
              loop
              muted
              playsInline
              className={`w-full h-full object-cover transition-all duration-150 ${
                activeTransition?.type === "zoom_in"
                  ? "scale-110 blur-[1px]"
                  : activeTransition?.type === "glitch"
                  ? "contrast-150 hue-rotate-90"
                  : ""
              }`}
            />

            {/* Next Video Element during Transition */}
            {activeTransition && nextClip && (
              <div
                className="absolute inset-0 transition-opacity duration-150"
                style={{
                  opacity: activeTransition.progress,
                }}
              >
                <video
                  ref={nextVideoRef}
                  src={nextClip.videoUrl}
                  poster={nextClip.thumbnailUrl}
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Flash White transition overlay */}
            {activeTransition?.type === "flash_white" && (
              <div
                className="absolute inset-0 bg-white pointer-events-none transition-opacity"
                style={{
                  opacity:
                    activeTransition.progress < 0.5
                      ? activeTransition.progress * 2
                      : (1 - activeTransition.progress) * 2,
                }}
              />
            )}

            {/* Glitch Strobe Overlay */}
            {activeTransition?.type === "glitch" && (
              <div className="absolute inset-0 pointer-events-none bg-cyan-500/20 mix-blend-screen" />
            )}

            {/* Character & Preset Overlay Badge */}
            {currentClip.characterProfile && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-[10px] text-emerald-300 flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="font-semibold">Nhân vật tham chiếu HD</span>
                <span className="text-slate-400">• {currentClip.characterProfile.outfit.slice(0, 20)}...</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-6 space-y-2 text-slate-500">
            <Smartphone className="w-12 h-12 mx-auto text-slate-700" />
            <p className="text-xs font-medium text-slate-400">Chưa có clip video nào</p>
            <p className="text-[11px] text-slate-600">
              Hãy nhấn &quot;Tạo Video Ngay&quot; ở bảng điều khiển bên trái.
            </p>
          </div>
        )}
      </div>

      {/* Scrubber & Controls Bar */}
      <div className="w-full space-y-2">
        {/* Scrubber track */}
        <div className="relative group">
          <input
            type="range"
            min="0"
            max={Math.max(1, totalDuration)}
            step="0.05"
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg group-hover:h-2 transition-all"
          />
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              disabled={clips.length === 0}
              className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center cursor-pointer transition-colors shadow-md disabled:opacity-40"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => onSeek(0)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Phát lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs text-slate-300">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                beatEngine.setVolume(nextMute ? 0 : 1);
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
