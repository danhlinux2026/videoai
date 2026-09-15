import React, { useState } from "react";
import {
  Film,
  Sparkles,
  Trash2,
  Copy,
  Zap,
  Clock,
  ArrowRightLeft,
  Sliders,
  Music,
  Plus,
  Minus,
  Check,
  Palette,
  ChevronDown,
  Volume2,
  Play,
  Square,
  Globe,
  FileText,
} from "lucide-react";
import { VideoClip, TransitionType, BeatMarker, VisualStyleCategory } from "../types";
import { edgeTts } from "../services/edgeTtsService";

interface TimelineEditorProps {
  clips: VideoClip[];
  currentTime: number;
  totalDuration: number;
  onSeek: (time: number) => void;
  onUpdateClip: (index: number, updated: Partial<VideoClip>) => void;
  onDeleteClip: (index: number) => void;
  onDuplicateClip: (index: number) => void;
  onUpdateTransition: (index: number, type: TransitionType, duration: number) => void;
  beatMarkers: BeatMarker[];
  onAddSampleClip: () => void;
  onSetAllClipsDuration?: (duration: number) => void;
}

const TRANSITION_OPTIONS: { id: TransitionType; label: string; icon: string }[] = [
  { id: "crossfade", label: "Hòa tan (Crossfade)", icon: "✨" },
  { id: "zoom_in", label: "Phóng to (Zoom In)", icon: "🔍" },
  { id: "whip_pan", label: "Lướt nhanh (Whip Pan)", icon: "💨" },
  { id: "flash_white", label: "Chớp trắng (Flash Hit)", icon: "⚡" },
  { id: "glitch", label: "Nhiễu sóng (Glitch)", icon: "👾" },
  { id: "blur_dissolve", label: "Mờ mềm (Blur)", icon: "💧" },
  { id: "none", label: "Cắt trực tiếp (Cut)", icon: "✂️" },
];

const STYLE_LABELS: Record<VisualStyleCategory, { label: string; color: string }> = {
  cinematic: { label: "Điện ảnh 8K", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  fashion_model: { label: "Người mẫu", color: "text-pink-400 border-pink-500/30 bg-pink-500/10" },
  "3d_animation": { label: "Hoạt hình 3D", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  playful_comic: { label: "Vui nhộn", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  anime_aesthetic: { label: "Anime", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
};

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  clips,
  currentTime,
  totalDuration,
  onSeek,
  onUpdateClip,
  onDeleteClip,
  onDuplicateClip,
  onUpdateTransition,
  beatMarkers,
  onAddSampleClip,
  onSetAllClipsDuration,
}) => {
  const [editingClipIndex, setEditingClipIndex] = useState<number | null>(null);
  const [playingVoiceClipIndex, setPlayingVoiceClipIndex] = useState<number | null>(null);
  const [expandedPromptClipIndex, setExpandedPromptClipIndex] = useState<number | null>(null);

  const handleDurationChange = (index: number, newDuration: number) => {
    // Clamp between 5s and 16s as requested by user
    const clamped = Math.max(5.0, Math.min(16.0, Number(newDuration.toFixed(1))));
    onUpdateClip(index, { duration: clamped });
  };

  const handlePlayClipVoiceover = (index: number, text?: string) => {
    if (!text) return;
    if (playingVoiceClipIndex === index) {
      edgeTts.stopSpeaking();
      setPlayingVoiceClipIndex(null);
      return;
    }
    setPlayingVoiceClipIndex(index);
    edgeTts.speakWebSpeech(
      text,
      {
        voicePersona: "woman_gentle",
        speed: 1.0,
        pitch: 0,
        rhythmStyle: "storyteller",
        volume: 100,
      },
      () => {},
      () => setPlayingVoiceClipIndex(null),
      () => setPlayingVoiceClipIndex(null)
    );
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Timeline 4-5 Cảnh Video & Chỉnh Sửa Thời Gian (5s - 16s)
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {clips.length} cảnh • Tổng {totalDuration.toFixed(1)}s
          </span>
          {clips.length >= 4 && clips.length <= 5 ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" />
              Đạt chuẩn 4-5 cảnh
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
              Khuyến nghị: 4 hoặc 5 cảnh
            </span>
          )}
        </div>

        {/* Global batch duration adjust presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Đặt đều độ dài mọi cảnh:</span>
          {[6, 8, 10, 12, 16].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => {
                if (onSetAllClipsDuration) {
                  onSetAllClipsDuration(sec);
                } else {
                  clips.forEach((_, idx) => handleDurationChange(idx, sec));
                }
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors"
              title={`Đặt tất cả ${clips.length} cảnh về ${sec} giây`}
            >
              {sec}s
            </button>
          ))}

          <button
            onClick={onAddSampleClip}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition-colors cursor-pointer ml-1"
          >
            <Plus className="w-3 h-3" />
            <span>Thêm cảnh</span>
          </button>
        </div>
      </div>

      {/* Main Multi-track area */}
      <div className="space-y-3 overflow-x-auto pb-2">
        {/* Track 1: Video Clips */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Film className="w-3 h-3 text-emerald-400" />
              <span>Chuỗi Cảnh Nhân Vật ({clips.length} Cảnh - Mỗi cảnh từ 5s đến 16s)</span>
            </span>
            <span className="text-[10px] text-slate-500">
              Kéo thanh trượt hoặc nhấn +/- để chỉnh thời gian từng cảnh
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-max p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80">
            {clips.map((clip, index) => {
              // Calculate rough width proportional to duration (clamped)
              const widthPx = Math.max(180, Math.min(320, clip.duration * 24));
              const styleInfo = clip.visualStyle ? STYLE_LABELS[clip.visualStyle] : null;

              return (
                <React.Fragment key={clip.id}>
                  {/* Clip Card */}
                  <div
                    style={{ width: `${widthPx}px` }}
                    className={`relative group bg-slate-900 border rounded-xl overflow-hidden shadow-md shrink-0 flex flex-col justify-between transition-all ${
                      editingClipIndex === index
                        ? "border-emerald-500 ring-2 ring-emerald-500/30"
                        : "border-slate-700/80 hover:border-emerald-500/70"
                    }`}
                  >
                    {/* Top Header: Scene Number & Visual Style */}
                    <div className="px-2.5 py-1 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Cảnh {index + 1}/{clips.length}
                      </span>
                      {styleInfo && (
                        <span className={`px-1.5 py-0.2 rounded border text-[9px] font-medium ${styleInfo.color}`}>
                          {styleInfo.label}
                        </span>
                      )}
                    </div>

                    {/* Thumbnail preview */}
                    <div className="h-20 w-full relative overflow-hidden bg-slate-950">
                      <img
                        src={clip.thumbnailUrl}
                        alt={clip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                      {/* Character Tag */}
                      {clip.characterProfile && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 border border-emerald-500/40 text-[9px] text-emerald-300 font-mono flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Khóa Nhân Vật</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => onDuplicateClip(index)}
                          className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white"
                          title="Nhân bản cảnh"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteClip(index)}
                          className="p-1 rounded bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white"
                          title="Xóa cảnh"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Clip Info & Editable Duration Controller */}
                    <div className="p-2.5 space-y-2 bg-slate-900">
                      <p className="text-xs font-bold text-white truncate" title={clip.title}>
                        {clip.title}
                      </p>

                      {/* Duration Controller (5s - 16s) */}
                      <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            Thời lượng:
                          </span>
                          <span className="font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            {clip.duration.toFixed(1)}s
                          </span>
                        </div>

                        {/* Interactive Slider (5.0s to 16.0s) */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDurationChange(index, clip.duration - 0.5)}
                            disabled={clip.duration <= 5.0}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
                            title="Giảm 0.5s"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>

                          <input
                            type="range"
                            min="5.0"
                            max="16.0"
                            step="0.5"
                            value={clip.duration}
                            onChange={(e) => handleDurationChange(index, parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                          />

                          <button
                            type="button"
                            onClick={() => handleDurationChange(index, clip.duration + 0.5)}
                            disabled={clip.duration >= 16.0}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
                            title="Tăng 0.5s"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Quick Presets within 5s - 16s */}
                        <div className="flex items-center justify-between pt-0.5">
                          {[5, 8, 10, 12, 16].map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => handleDurationChange(index, sec)}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all ${
                                Math.round(clip.duration) === sec
                                  ? "bg-emerald-500 text-slate-950 font-bold"
                                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                              }`}
                            >
                              {sec}s
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Voiceover Script Pill & Play button */}
                      {clip.voiceoverScript && (
                        <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[10px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-300 font-bold flex items-center gap-1">
                              <Volume2 className="w-2.5 h-2.5 text-emerald-400" />
                              Lời thoại kịch bản:
                            </span>
                            <button
                              type="button"
                              onClick={() => handlePlayClipVoiceover(index, clip.voiceoverScript)}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5 cursor-pointer ${
                                playingVoiceClipIndex === index
                                  ? "bg-rose-500 text-white animate-pulse"
                                  : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                              }`}
                            >
                              {playingVoiceClipIndex === index ? (
                                <Square className="w-2 h-2" />
                              ) : (
                                <Play className="w-2 h-2" />
                              )}
                              <span>{playingVoiceClipIndex === index ? "Dừng" : "Phát"}</span>
                            </button>
                          </div>
                          <p className="text-slate-300 line-clamp-2 italic">
                            "{clip.voiceoverScript}"
                          </p>
                        </div>
                      )}

                      {/* Bilingual Prompt Toggle */}
                      {(clip.englishPrompt || clip.vietnameseNotes) && (
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedPromptClipIndex(
                                expandedPromptClipIndex === index ? null : index
                              )
                            }
                            className="w-full text-left text-[9px] font-semibold text-cyan-400/90 hover:text-cyan-300 flex items-center justify-between pt-0.5"
                          >
                            <span className="flex items-center gap-1">
                              <Globe className="w-2.5 h-2.5 text-cyan-400" />
                              {expandedPromptClipIndex === index
                                ? "Thu gọn Prompt & Ghi chú"
                                : "Xem Prompt EN & Ghi chú VN"}
                            </span>
                            <ChevronDown
                              className={`w-2.5 h-2.5 transition-transform ${
                                expandedPromptClipIndex === index ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {expandedPromptClipIndex === index && (
                            <div className="mt-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[9px] space-y-1.5 animate-in fade-in">
                              {clip.englishPrompt && (
                                <div>
                                  <span className="text-cyan-300 font-bold block">Prompt AI (EN):</span>
                                  <p className="text-slate-300 font-mono text-[8px] leading-relaxed line-clamp-3">
                                    {clip.englishPrompt}
                                  </p>
                                </div>
                              )}
                              {clip.vietnameseNotes && (
                                <div>
                                  <span className="text-amber-300 font-bold block">Ghi chú (VN):</span>
                                  <p className="text-slate-400 text-[8px] leading-relaxed line-clamp-3">
                                    {clip.vietnameseNotes}
                                  </p>
                                </div>
                              )}
                              {(clip.characterActionNotes || clip.characterActionPrompt) && (
                                <div className="pt-1 border-t border-slate-900">
                                  <span className="text-purple-300 font-bold block">Hành động nhân vật:</span>
                                  <p className="text-slate-300 text-[8px] leading-relaxed">
                                    {clip.characterActionNotes || clip.characterActionPrompt}
                                  </p>
                                </div>
                              )}
                              {(clip.contextEnvironmentNotes || clip.contextEnvironmentPrompt) && (
                                <div className="pt-1 border-t border-slate-900">
                                  <span className="text-teal-300 font-bold block">Bối cảnh không gian:</span>
                                  <p className="text-slate-300 text-[8px] leading-relaxed">
                                    {clip.contextEnvironmentNotes || clip.contextEnvironmentPrompt}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inter-clip Transition Pill */}
                  {index < clips.length - 1 && (
                    <div className="shrink-0 flex flex-col items-center justify-center px-1">
                      <div className="relative group/trans">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                          title="Nhấn để đổi hiệu ứng chuyển cảnh"
                        >
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>
                            {clip.transitionToNext?.type
                              ? clip.transitionToNext.type.replace("_", " ")
                              : "Crossfade"}
                          </span>
                        </button>

                        {/* Transition popup picker on hover/focus */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-48 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-30 hidden group-hover/trans:block animate-in fade-in">
                          <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                            Chọn hiệu ứng chuyển:
                          </span>
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {TRANSITION_OPTIONS.map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() =>
                                  onUpdateTransition(
                                    index,
                                    opt.id,
                                    clip.transitionToNext?.duration || 0.6
                                  )
                                }
                                className={`w-full px-2 py-1 rounded-lg text-left text-[11px] flex items-center gap-1.5 transition-colors ${
                                  clip.transitionToNext?.type === opt.id
                                    ? "bg-emerald-500/20 text-emerald-300 font-bold"
                                    : "text-slate-300 hover:bg-slate-800"
                                }`}
                              >
                                <span>{opt.icon}</span>
                                <span>{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 font-mono">
                        {(clip.transitionToNext?.duration || 0.6).toFixed(1)}s
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Track 2: Audio Beat Track */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Music className="w-3 h-3 text-emerald-400" />
              Lớp 2: Nhịp Điệu Nhạc Nền (Beat Grid & Auto-Sync Markers)
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              Điểm rơi nốt nhạc (Drop Beats)
            </span>
          </div>

          {/* Beat visualizer timeline */}
          <div className="h-10 w-full bg-slate-950/80 rounded-xl border border-slate-800 relative overflow-hidden flex items-center px-2">
            {/* Visual Beat drop markers */}
            {beatMarkers.slice(0, 40).map((marker, idx) => {
              const leftPercent = (marker.timestamp / Math.max(totalDuration, 1)) * 100;
              if (leftPercent > 100) return null;

              return (
                <div
                  key={idx}
                  style={{ left: `${leftPercent}%` }}
                  className={`absolute top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none ${
                    marker.isDrop ? "w-1 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "w-0.5 bg-emerald-500/60"
                  }`}
                  title={`Beat: ${marker.timestamp}s`}
                >
                  {marker.isDrop && (
                    <span className="absolute -top-1 w-2 h-2 rounded-full bg-cyan-300 shadow-sm" />
                  )}
                </div>
              );
            })}

            {/* Playhead indicator */}
            <div
              style={{
                left: `${Math.min(100, (currentTime / Math.max(totalDuration, 1)) * 100)}%`,
              }}
              className="absolute top-0 bottom-0 w-0.5 bg-red-400 shadow-[0_0_10px_rgba(248,113,113,1)] z-10 pointer-events-none transition-all duration-75"
            >
              <div className="w-2.5 h-2.5 -ml-1 -top-1 absolute bg-red-500 rounded-full border border-white" />
            </div>

            <div className="absolute inset-x-0 bottom-1 flex items-center justify-between px-3 text-[9px] text-slate-600 font-mono pointer-events-none">
              <span>00:00</span>
              <span>Đồng bộ nhịp điệu chuyển cảnh</span>
              <span>{totalDuration.toFixed(1)}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
