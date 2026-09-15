export type AgnesVideoModelId =
  | "agnes-video-v2.0"
  | "agnes-video-2.5-flash"
  | "minimax-video-01"
  | "pixverse-v2";

export type AgnesImageModelId =
  | "agnes-image-2.1-flash"
  | "agnes-image-2.0-flash";

export type AgnesModelId = AgnesVideoModelId;

export type GenerationMode =
  | "text-to-video"
  | "image-to-video"
  | "video-to-video"
  | "character-scene"
  | "multi-scene-storyboard";

export type VisualStyleCategory =
  | "cinematic" // Điện ảnh 8K chân thực
  | "fashion_model" // Người mẫu / Thời trang High-Fashion
  | "3d_animation" // Hoạt hình 3D (Pixar/Disney)
  | "playful_comic" // Vui nhộn / Hoạt náo
  | "anime_aesthetic"; // Anime Nhật Bản cao cấp

export type ReferencePhotoAngle =
  | "front" // Chính diện 0°
  | "profile_45" // Góc nghiêng 45°
  | "side" // Góc nghiêng
  | "expression_smile" // Cười / Biểu cảm sống động
  | "full_body" // Bán thân / Toàn thân
  | "custom";

export interface ReferencePhoto {
  id: string;
  url: string;
  angle: ReferencePhotoAngle;
  label: string;
  description?: string;
  qualityMetrics?: ImageQualityMetrics;
  isPrimary?: boolean;
}

export type TransitionType =
  | "none"
  | "crossfade"
  | "zoom_in"
  | "whip_pan"
  | "flash_white"
  | "glitch"
  | "blur_dissolve";

export type CameraMotion =
  | "static"
  | "pan_left"
  | "pan_right"
  | "tilt_up"
  | "tilt_down"
  | "zoom_in"
  | "zoom_out"
  | "orbit_360";

export type AspectRatio = "9:16" | "16:9" | "1:1";

export interface ImageQualityMetrics {
  width: number;
  height: number;
  megapixels: number;
  sharpnessScore: number; // 0-100
  pixelationRisk: "none" | "low" | "moderate" | "high";
  dynamicRange: "optimal" | "underexposed" | "overexposed";
  faceDetected: boolean;
  qualityRating: "8K Ultra-HD" | "HD 1080p" | "Tiêu chuẩn" | "Độ phân giải thấp";
  isOptimized: boolean;
}

export interface GeneratedCharacterImage {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  outfit: string;
  expression: string;
  lighting: string;
  framing: string;
  model: string;
  timestamp: number;
  prompt: string;
  isHighFidelity: boolean;
  visualStyle?: VisualStyleCategory;
}

export interface CharacterProfile {
  referenceImage: string; // URL or base64 of primary photo
  referencePhotos?: ReferencePhoto[]; // Multiple reference photos for rich biometric reconstruction
  enhancedImage?: string; // Pre-processed, super-resolved & anti-aliased base64
  multiAngleCompositeUrl?: string; // Unified multi-angle fused composite
  visualStyle: VisualStyleCategory; // Visual style across the entire video
  outfit: string;
  expression: string;
  expressionIntensity: number; // 0-100
  preserveFaceDetail: boolean; // Keep high fidelity face without distortion
  lighting?: string;
  framing?: string;
  qualityMetrics?: ImageQualityMetrics;
  biometricDescription?: string;
  generatedVariants?: GeneratedCharacterImage[];
}

export type VoicePersona =
  | "child_boy" // Trẻ con (Bé trai hồn nhiên)
  | "child_girl" // Trẻ con (Bé gái trong trẻo)
  | "elderly_man" // Người già (Cụ ông trầm ấm)
  | "elderly_woman" // Người già (Cụ bà đôn hậu)
  | "woman_gentle" // Phụ nữ (Hoài My - Dịu dàng, truyền cảm)
  | "woman_energetic" // Phụ nữ (Thảo Vy - Trẻ trung, thời sự)
  | "man_confident" // Nam giới (Nam Minh - Bản lĩnh, truyền cảm)
  | "man_deep" // Nam giới (Tuấn Kiệt - Trầm bổng điện ảnh)
  | "custom_upload"; // Giọng tải lên từ file âm thanh riêng

export type RhythmStyle = "natural" | "storyteller" | "energetic" | "poetic" | "news";

export interface EdgeTtsSettings {
  voicePersona: VoicePersona;
  speed: number; // 0.5 to 2.0 (mặc định 1.0)
  pitch: number; // -10 to +10 (trầm đến bổng, mặc định 0)
  rhythmStyle: RhythmStyle; // Nhịp điệu tùy chỉnh
  volume: number; // 0 to 100%
  customAudioUrl?: string; // File âm thanh người dùng tải lên
  customAudioName?: string;
}

export interface StoryboardScene {
  id: string;
  sceneNumber: number; // 1 to 5
  title: string;
  description: string;
  duration: number; // 5 to 16 seconds
  cameraMotion: CameraMotion;
  outfitVariation?: string;
  expressionVariation?: string;
  lighting?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  status: "draft" | "rendering" | "ready";
  // Voiceover & Script audio
  voiceoverScript?: string; // Lời thoại / Thuyết minh tiếng Việt trích xuất từ kịch bản
  voiceoverAudioUrl?: string; // Âm thanh giọng nói đã tạo cho cảnh này
  isVoiceoverPlaying?: boolean;
  // English AI Prompts + Vietnamese Notes
  englishPrompt?: string; // Prompt tiếng Anh xuất cho mô hình AI video/image
  vietnameseNotes?: string; // Ghi chú tiếng Việt giải thích cho người dùng dễ hiểu và chỉnh sửa
  characterVfxPrompt?: string; // Prompt tiếng Anh về hiệu ứng nhân vật (ánh sáng viền, hạt bụi vàng, biểu cảm)
  characterVfxNotes?: string; // Ghi chú tiếng Việt về hiệu ứng nhân vật
  environmentPrompt?: string; // Prompt tiếng Anh về bối cảnh không gian & thời tiết
  environmentNotes?: string; // Ghi chú tiếng Việt về bối cảnh
}

export interface VideoClip {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds (5.0s to 16.0s)
  prompt: string;
  model: string;
  sceneIndex?: number; // 1 to 5
  visualStyle?: VisualStyleCategory;
  characterProfile?: CharacterProfile;
  voiceoverScript?: string;
  voiceoverAudioUrl?: string;
  englishPrompt?: string;
  vietnameseNotes?: string;
  transitionToNext?: {
    type: TransitionType;
    duration: number; // seconds e.g. 0.5
  };
}

export interface AudioTrackItem {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  duration: number;
  url: string;
  isCustom?: boolean;
}

export interface BeatMarker {
  timestamp: number; // seconds
  intensity: number; // 0-1
  isDrop?: boolean;
}

export interface GenerationTaskState {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  model: string;
  mode: GenerationMode;
  prompt: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  characterInfo?: Partial<CharacterProfile>;
  duration: number;
  aspectRatio: AspectRatio;
  error?: string;
  isRealApi?: boolean;
  stepMessage?: string;
}

export interface ApiConfig {
  agnesApiKey: string;
  agnesBaseUrl: string;
  isAgnesConfigured: boolean;
  isGeminiConfigured: boolean;
}
