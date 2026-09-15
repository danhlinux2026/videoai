import React, { useState } from "react";
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Wand2,
  Camera,
  Layers,
  Clock,
  Maximize2,
  RefreshCw,
  PlusCircle,
  Play,
  Film,
} from "lucide-react";
import {
  GenerationMode,
  AspectRatio,
  CameraMotion,
  AgnesModelId,
  CharacterProfile,
  GenerationTaskState,
} from "../types";
import { AgnesApiService, GenerateVideoParams } from "../services/agnesApi";

interface VideoGeneratorProps {
  characterProfile: CharacterProfile;
  onClipCreated: (clip: {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
    prompt: string;
    model: string;
    characterProfile?: CharacterProfile;
  }) => void;
  apiConfig: {
    agnesApiKey: string;
    agnesBaseUrl: string;
    isAgnesConfigured: boolean;
  };
}

const MODELS = [
  {
    id: "agnes-video-v2.0" as AgnesModelId,
    name: "Agnes Video V2.0",
    badge: "Khuyên dùng",
    desc: "Độ phân giải cao, giữ nét nhân vật tối đa, chuyển động mượt mà",
  },
  {
    id: "agnes-video-2.5-flash" as AgnesModelId,
    name: "Agnes Video 2.5 Flash",
    badge: "Tốc độ cao",
    desc: "Tạo cực nhanh cho video ngắn 5s, tối ưu nhịp điệu chuyển động",
  },
  {
    id: "minimax-video-01" as AgnesModelId,
    name: "MiniMax Multimodal 2K",
    badge: "2K Cinematic",
    desc: "Khung hình điện ảnh 2K, ánh sáng thể tích ray-traced",
  },
  {
    id: "pixverse-v2" as AgnesModelId,
    name: "PixVerse V2 Motion",
    badge: "Camera FX",
    desc: "Hiệu ứng ống kính và chuyển động camera linh hoạt",
  },
];

const CAMERA_MOTIONS: { id: CameraMotion; label: string }[] = [
  { id: "static", label: "Tĩnh (Cinematic Static)" },
  { id: "zoom_in", label: "Dolly Zoom In" },
  { id: "zoom_out", label: "Zoom Out Mở Rộng" },
  { id: "pan_left", label: "Lướt Sang Trái (Pan Left)" },
  { id: "pan_right", label: "Lướt Sang Phải (Pan Right)" },
  { id: "tilt_up", label: "Nâng Ống Kính (Tilt Up)" },
  { id: "tilt_down", label: "Hạ Ống Kính (Tilt Down)" },
  { id: "orbit_360", label: "Xoay Vòng 360°" },
];

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  characterProfile,
  onClipCreated,
  apiConfig,
}) => {
  const [mode, setMode] = useState<GenerationMode>("text-to-video");
  const [model, setModel] = useState<AgnesModelId>("agnes-video-v2.0");
  const [prompt, setPrompt] = useState(
    "Nữ người mẫu phong cách cyberpunk dạo bước trên con phố đêm mưa Tokyo ngập tràn ánh đèn neon phản chiếu, góc máy slow motion 4k điện ảnh."
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [duration, setDuration] = useState<number>(5);
  const [resolution, setResolution] = useState<string>("1080p");
  const [cameraMotion, setCameraMotion] = useState<CameraMotion>("zoom_in");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [sourceVideoUrl, setSourceVideoUrl] = useState<string>("");
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [activeTask, setActiveTask] = useState<GenerationTaskState | null>(null);

  // Quick prompt templates
  const SAMPLE_PROMPTS = [
    {
      title: "Cyberpunk Tokyo Rain",
      text: "Nữ nhân vật cyberpunk bước đi chậm rãi trên phố đêm Tokyo mưa ướt, ánh đèn neon tím và xanh phản chiếu vũng nước, camera slow-motion.",
    },
    {
      title: "Trang Phục Áo Dài Phố Cổ",
      text: "Nhân vật mặc áo dài truyền thống lụa thêu hoa sen dạo bước qua mái ngói rêu phong phố cổ Hội An, nắng chiều vàng ươm dịu nhẹ.",
    },
    {
      title: "Dạ Tiệc Luxury Gala",
      text: "Nhân vật diện đầm dạ tiệc lụa đen quý phái bước xuống cầu thang cung điện tráng lệ, ánh đèn chùm pha lê lấp lánh.",
    },
    {
      title: "Chiến Binh Mecha Tương Lai",
      text: "Chiến binh khoác giáp titan tương lai đứng trên nóc tòa nhà chọc trời lúc hoàng hôn, gió thổi mạnh làm bay tà áo.",
    },
  ];

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancingPrompt(true);
    try {
      const enhanced = await AgnesApiService.enhancePrompt(prompt, characterProfile);
      setPrompt(enhanced);
    } catch (e) {
      console.warn("Enhance prompt failed, keeping original:", e);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && mode !== "image-to-video") return;

    const initialTask: GenerationTaskState = {
      id: "task_init_" + Date.now(),
      status: "processing",
      progress: 5,
      model,
      mode,
      prompt,
      duration,
      aspectRatio,
      characterInfo: characterProfile,
      stepMessage: "Khởi tạo tác vụ tạo video với Agnes AI...",
    };
    setActiveTask(initialTask);

    try {
      const activeReferenceImage = characterProfile.enhancedImage || characterProfile.referenceImage;

      const params: GenerateVideoParams = {
        prompt,
        model,
        mode,
        aspect_ratio: aspectRatio,
        duration,
        resolution,
        camera_motion: cameraMotion,
        character_options: mode === "character-scene" || activeReferenceImage ? characterProfile : undefined,
        image_url: mode === "image-to-video" ? imageUrl || activeReferenceImage : undefined,
        reference_image: activeReferenceImage,
        video_url: mode === "video-to-video" ? sourceVideoUrl : undefined,
        apiKey: apiConfig.agnesApiKey,
        baseUrl: apiConfig.agnesBaseUrl,
      };

      const result = await AgnesApiService.generateVideo(params);
      const taskId = result.task_id;

      // Start polling
      const pollInterval = setInterval(async () => {
        try {
          const status = await AgnesApiService.pollTask(taskId, apiConfig.agnesApiKey, apiConfig.agnesBaseUrl);
          setActiveTask(status);

          if (status.status === "completed" && status.videoUrl) {
            clearInterval(pollInterval);
            // Add new clip to timeline
            onClipCreated({
              id: "clip_" + Date.now(),
              title: prompt.slice(0, 32) + (prompt.length > 32 ? "..." : ""),
              videoUrl: status.videoUrl,
              thumbnailUrl: status.thumbnailUrl || characterProfile.referenceImage || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
              duration,
              prompt,
              model,
              characterProfile: characterProfile.referenceImage ? characterProfile : undefined,
            });
          } else if (status.status === "failed") {
            clearInterval(pollInterval);
          }
        } catch (pollErr) {
          console.warn("Poll check error:", pollErr);
        }
      }, 1500);
    } catch (err: any) {
      setActiveTask({
        ...initialTask,
        status: "failed",
        error: err.message || "Lỗi tạo video",
      });
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl">
      {/* Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Video className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Studio Tạo & Chỉnh Sửa Video Agnes AI
            </h2>
            <p className="text-xs text-slate-400">
              Hỗ trợ Text-to-Video, Image-to-Video, Video-to-Video & Cảnh Nhân vật
            </p>
          </div>
        </div>

        {/* Mode switcher pills */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode("text-to-video")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "text-to-video"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Text to Video
          </button>
          <button
            onClick={() => setMode("image-to-video")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "image-to-video"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Image to Video
          </button>
          <button
            onClick={() => setMode("video-to-video")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "video-to-video"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Chỉnh sửa qua Prompt
          </button>
          <button
            onClick={() => setMode("character-scene")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "character-scene"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cảnh Nhân Vật Tham Chiếu
          </button>
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mô hình Video AI (Agnes AI Ecosystem)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setModel(m.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                model === m.id
                  ? "bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950/50"
                  : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold truncate">{m.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    model === m.id
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {m.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Image or Video Source Inputs if Image-to-Video or Video-to-Video */}
      {mode === "image-to-video" && (
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ảnh gốc để tạo chuyển động (Image Source)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl || characterProfile.enhancedImage || characterProfile.referenceImage || ""}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Nhập URL ảnh hoặc dùng ảnh nhân vật tham chiếu hiện tại..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
            />
            {(characterProfile.enhancedImage || characterProfile.referenceImage) && (
              <button
                type="button"
                onClick={() => setImageUrl(characterProfile.enhancedImage || characterProfile.referenceImage)}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-medium transition-colors"
              >
                Dùng ảnh tham chiếu {characterProfile.enhancedImage ? "(HD Đã Nâng Cấp)" : ""}
              </button>
            )}
          </div>
          {characterProfile.enhancedImage && (
            <p className="text-[10px] text-emerald-400 font-medium">
              ✨ Đang sử dụng ảnh nhân vật chuẩn Super-Resolution 8K (Không vỡ nét & Khóa landmark)
            </p>
          )}
        </div>
      )}

      {mode === "video-to-video" && (
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-emerald-400" />
            <span>URL Video cần chỉnh sửa hoặc biến đổi qua prompt (Video-to-Video)</span>
          </label>
          <input
            type="text"
            value={sourceVideoUrl}
            onChange={(e) => setSourceVideoUrl(e.target.value)}
            placeholder="https://... hoặc chọn video từ danh sách timeline..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      )}

      {/* Prompt Section with Gemini AI Enhancer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mô Tả Cảnh Video (Prompt)</span>
          </label>

          <button
            type="button"
            onClick={handleEnhancePrompt}
            disabled={isEnhancingPrompt || !prompt.trim()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-medium text-emerald-300 transition-all cursor-pointer disabled:opacity-50"
            title="Sử dụng Gemini AI để mở rộng prompt thành kịch bản điện ảnh chuẩn Agnes AI"
          >
            <Sparkles className={`w-3 h-3 ${isEnhancingPrompt ? "animate-spin" : ""}`} />
            <span>{isEnhancingPrompt ? "Đang nâng cấp kịch bản..." : "AI Tối Ưu Prompt Điện Ảnh"}</span>
          </button>
        </div>

        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Mô tả hành động, ánh sáng, góc máy và trang phục nhân vật..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none leading-relaxed"
        />

        {/* Quick sample prompt chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[10px] text-slate-500 whitespace-nowrap">Gợi ý nhanh:</span>
          {SAMPLE_PROMPTS.map((sp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(sp.text)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 whitespace-nowrap transition-colors"
            >
              {sp.title}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Video Settings: Aspect, Duration, Camera, Resolution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
        {/* Aspect Ratio */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Maximize2 className="w-3 h-3 text-slate-500" />
            Tỉ lệ khung hình
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(["9:16", "16:9", "1:1"] as AspectRatio[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setAspectRatio(r)}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  aspectRatio === r
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            Thời lượng video
          </label>
          <div className="grid grid-cols-2 gap-1">
            {[5, 10].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  duration === d
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                {d} Giây
              </button>
            ))}
          </div>
        </div>

        {/* Camera Motion */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Camera className="w-3 h-3 text-slate-500" />
            Chuyển động Camera
          </label>
          <select
            value={cameraMotion}
            onChange={(e) => setCameraMotion(e.target.value as CameraMotion)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {CAMERA_MOTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Resolution */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Độ phân giải</label>
          <div className="grid grid-cols-3 gap-1">
            {["720p", "1080p", "2K"].map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  resolution === res
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generation Task Progress Bar if in progress */}
      {activeTask && activeTask.status === "processing" && (
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Đang kết xuất video qua Agnes AI Model...</span>
            </div>
            <span className="font-mono text-emerald-400 font-bold">{activeTask.progress}%</span>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${activeTask.progress}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400">
            {activeTask.progress < 25 && "1/4: Đang phân tích khuôn mặt & trang phục tham chiếu..."}
            {activeTask.progress >= 25 && activeTask.progress < 50 && "2/4: Khóa cấu trúc landmark 8K & tính toán chuyển động..."}
            {activeTask.progress >= 50 && activeTask.progress < 80 && "3/4: Render khung hình đa chiều với độ phân giải 1080p..."}
            {activeTask.progress >= 80 && "4/4: Khử nhiễu, nâng cấp sắc nét và hoàn thiện clip..."}
          </p>
        </div>
      )}

      {/* Main Generate Button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={activeTask?.status === "processing" || !prompt.trim()}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/20 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {activeTask?.status === "processing" ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            <span>Đang tạo video ({activeTask.progress}%)...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Tạo Video Ngay Với Agnes AI</span>
          </>
        )}
      </button>
    </div>
  );
};
