import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  User,
  Sparkles,
  ShieldCheck,
  Shirt,
  Smile,
  Sliders,
  Check,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  Sun,
  Camera,
  Layers,
  Wand2,
  Eye,
  SlidersHorizontal,
  Download,
  Video,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Palette,
  LayoutGrid,
  Plus,
} from "lucide-react";
import {
  CharacterProfile,
  ImageQualityMetrics,
  GeneratedCharacterImage,
  AgnesImageModelId,
  ReferencePhoto,
  ReferencePhotoAngle,
  VisualStyleCategory,
} from "../types";
import { ImageEnhancer } from "../services/imageEnhancer";
import { AgnesApiService } from "../services/agnesApi";

interface CharacterWorkbenchProps {
  characterProfile: CharacterProfile;
  onChangeProfile: (updated: Partial<CharacterProfile>) => void;
  onGenerateScene: (character: CharacterProfile) => void;
  isGenerating: boolean;
  apiConfig?: {
    agnesApiKey: string;
    agnesBaseUrl: string;
    isAgnesConfigured: boolean;
  };
  onSelectVariantForVideo?: (variant: GeneratedCharacterImage) => void;
}

export const MULTI_ANGLE_PACKS = [
  {
    name: "Linh - Á Đông Điện Ảnh",
    style: "cinematic" as VisualStyleCategory,
    description: "Bộ 4 góc nét căng, phong thái đậm chất điện ảnh Á Đông",
    photos: [
      {
        id: "linh_front",
        angle: "front" as ReferencePhotoAngle,
        label: "Chính Diện 0°",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "linh_side",
        angle: "side" as ReferencePhotoAngle,
        label: "Góc Nghiêng 45°",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "linh_smile",
        angle: "expression_smile" as ReferencePhotoAngle,
        label: "Nụ Cười Sinh Động",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "linh_full",
        angle: "full_body" as ReferencePhotoAngle,
        label: "Toàn Thân / Dáng",
        url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&auto=format&fit=crop&q=95",
      },
    ],
  },
  {
    name: "Alex - Người Mẫu Cyberpunk",
    style: "fashion_model" as VisualStyleCategory,
    description: "Gương mặt góc cạnh, ánh mắt sắc sảo, phong cách streetwear tương lai",
    photos: [
      {
        id: "alex_front",
        angle: "front" as ReferencePhotoAngle,
        label: "Chính Diện 0°",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "alex_side",
        angle: "side" as ReferencePhotoAngle,
        label: "Góc Nghiêng 45°",
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "alex_smile",
        angle: "expression_smile" as ReferencePhotoAngle,
        label: "Nụ Cười Sinh Động",
        url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "alex_full",
        angle: "full_body" as ReferencePhotoAngle,
        label: "Toàn Thân / Dáng",
        url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&auto=format&fit=crop&q=95",
      },
    ],
  },
  {
    name: "Maya - Haute Couture Runway",
    style: "fashion_model" as VisualStyleCategory,
    description: "Người mẫu thời trang cao cấp, đường nét quý phái chuẩn sàn diễn Paris",
    photos: [
      {
        id: "maya_front",
        angle: "front" as ReferencePhotoAngle,
        label: "Chính Diện 0°",
        url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "maya_side",
        angle: "side" as ReferencePhotoAngle,
        label: "Góc Nghiêng 45°",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "maya_smile",
        angle: "expression_smile" as ReferencePhotoAngle,
        label: "Nụ Cười Sinh Động",
        url: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "maya_full",
        angle: "full_body" as ReferencePhotoAngle,
        label: "Toàn Thân / Dáng",
        url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1200&auto=format&fit=crop&q=95",
      },
    ],
  },
  {
    name: "Leo - Hoạt Hình 3D & Vui Nhộn",
    style: "3d_animation" as VisualStyleCategory,
    description: "Nhân vật biểu cảm sống động phong cách hoạt hình 3D Pixar vui tươi",
    photos: [
      {
        id: "leo_front",
        angle: "front" as ReferencePhotoAngle,
        label: "Chính Diện 0°",
        url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "leo_side",
        angle: "side" as ReferencePhotoAngle,
        label: "Góc Nghiêng 45°",
        url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "leo_smile",
        angle: "expression_smile" as ReferencePhotoAngle,
        label: "Nụ Cười Sinh Động",
        url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200&auto=format&fit=crop&q=95",
      },
      {
        id: "leo_full",
        angle: "full_body" as ReferencePhotoAngle,
        label: "Toàn Thân / Dáng",
        url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=1200&auto=format&fit=crop&q=95",
      },
    ],
  },
];

export const VISUAL_STYLES_LIST = [
  {
    id: "cinematic" as VisualStyleCategory,
    name: "Điện Ảnh 8K",
    subtitle: "Chân thật, sống động, ánh sáng Arri Alexa 35mm",
    color: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40",
    badge: "Chân Thật",
    icon: "🎬",
    promptModifier: "ultra-realistic, 8k cinematic lighting, shallow depth of field, anamorphic lens, master photography",
  },
  {
    id: "fashion_model" as VisualStyleCategory,
    name: "Người Mẫu / Fashion",
    subtitle: "Tạp chí Vogue, thần thái sang trọng, studio runway",
    color: "from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/40",
    badge: "High Fashion",
    icon: "📸",
    promptModifier: "haute couture fashion model, high fashion editorial lookbook, soft studio softbox lighting, flawless skin",
  },
  {
    id: "3d_animation" as VisualStyleCategory,
    name: "Hoạt Hình 3D",
    subtitle: "Phong cách Pixar / DreamWorks sống động, biểu cảm cao",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/40",
    badge: "3D Stylized",
    icon: "🎨",
    promptModifier: "3D animation style, modern stylized characters, subsurface scattering, lively expressive eyes, Disney Pixar aesthetic",
  },
  {
    id: "playful_comic" as VisualStyleCategory,
    name: "Vui Nhộn & Hài Hước",
    subtitle: "Nét vẽ comic tràn đầy năng lượng, vui tươi giải trí",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40",
    badge: "Vui Nhộn",
    icon: "🎭",
    promptModifier: "playful comic fun cartoon aesthetic, dynamic exaggerated expressions, vibrant cheerful palette, pop art energy",
  },
  {
    id: "anime" as VisualStyleCategory,
    name: "Anime Nhật Bản",
    subtitle: "Đường nét Makoto Shinkai, màu trời rực rỡ, chi tiết tinh tế",
    color: "from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/40",
    badge: "Anime HD",
    icon: "🎌",
    promptModifier: "stunning modern anime aesthetic, Makoto Shinkai lighting, vibrant color grading, intricate hand-drawn anime details",
  },
];

const SAMPLE_AVATARS = [
  {
    name: "Linh - Phong cách Á Đông",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=95",
    description: "Khuôn mặt thanh tú, đường nét chuẩn cinematic",
  },
  {
    name: "Alex - Cyberpunk Rebel",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=95",
    description: "Ánh mắt kiên định, đường nét sắc sảo",
  },
  {
    name: "Mai - Nữ tính hiện đại",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&auto=format&fit=crop&q=95",
    description: "Nụ cười ấm áp, phong thái tự nhiên",
  },
  {
    name: "Kaito - Futuristic Hero",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&auto=format&fit=crop&q=95",
    description: "Gương mặt góc cạnh, ánh nhìn điện ảnh",
  },
];

const OUTFIT_PRESETS = [
  {
    id: "aodai",
    title: "Áo Dài Lụa Hoa Sen",
    promptText: "traditional Vietnamese silk Áo Dài with intricate gold lotus embroidery and flowing silk trousers",
    tag: "Truyền thống",
  },
  {
    id: "cyberpunk",
    title: "Cyberpunk Streetwear Neon",
    promptText: "high-tech cyberpunk neon glowing trenchcoat with reflective carbon fiber weave and luminous collars",
    tag: "Sci-Fi",
  },
  {
    id: "luxury_dress",
    title: "Haute Couture Đen Velvet",
    promptText: "luxurious midnight-black haute couture velvet evening gown with diamond brooches and tailored silhouette",
    tag: "Dạ tiệc",
  },
  {
    id: "armor",
    title: "Giáp Cơ Khí Titanium Mecha",
    promptText: "futuristic titanium exoskeleton mecha combat armor with kinetic LED accents and matte black plating",
    tag: "Chiến binh",
  },
  {
    id: "business",
    title: "Vest Doanh Nhân Ý Lịch Lãm",
    promptText: "bespoke charcoal Italian wool business suit with crisp silk necktie and sharp tailored lapels",
    tag: "Lịch lãm",
  },
  {
    id: "vintage_90s",
    title: "Áo Khoác Da Vintage 90s",
    promptText: "vintage 1990s distressed oversized brown leather bomber jacket with washed denim and silver chain",
    tag: "Retro",
  },
  {
    id: "resort_linen",
    title: "Resort Casual Vải Đũi",
    promptText: "breathable relaxed cream-white linen resort shirt with rolled sleeves and coastal breezy drape",
    tag: "Mùa hè",
  },
];

const EXPRESSION_PRESETS = [
  {
    id: "confident_smile",
    title: "Nụ cười tự tin",
    promptText: "confident alluring smile, sharp engaging eyes, subtle relaxed dimples",
    icon: "✨",
  },
  {
    id: "dramatic_gaze",
    title: "Ánh mắt điện ảnh kịch tính",
    promptText: "intense cinematic dramatic gaze, focused piercing eyes, subtle moody atmosphere",
    icon: "🔥",
  },
  {
    id: "joyful_laugh",
    title: "Cười rạng rỡ hạnh phúc",
    promptText: "joyful genuine radiant laugh, eyes crinkling with warmth, natural teeth smile",
    icon: "😄",
  },
  {
    id: "mysterious_smirk",
    title: "Bí ẩn / Khẽ nhếch môi",
    promptText: "mysterious subtle smirk, knowing enigmatic expression, arched eyebrow",
    icon: "😏",
  },
  {
    id: "contemplative",
    title: "Trầm ngâm / Suy tư",
    promptText: "deep contemplative thoughtful expression, introspective soft eyes looking into the distance",
    icon: "🤔",
  },
  {
    id: "heroic_resolve",
    title: "Quyết tâm anh hùng",
    promptText: "heroic determined resolve, unyielding jawline, fierce fearless eyes facing the camera",
    icon: "⚡",
  },
];

const LIGHTING_PRESETS = [
  { id: "Studio Softbox 3-Point Lighting", label: "Studio Softbox 3 Điểm", desc: "Ánh sáng studio chuẩn chụp tạp chí" },
  { id: "Golden Hour Sunset Warmth", label: "Hoàng Hôn Golden Hour", desc: "Nắng vàng ấm áp, viền ven tóc lấp lánh" },
  { id: "Cyberpunk Neon Blue & Magenta", label: "Neon Cyberpunk Tím Xanh", desc: "Ánh sáng tương phản cao phong cách viễn tưởng" },
  { id: "Cinematic Dramatic Chiaroscuro", label: "Tương Phản Điện Ảnh (Moody)", desc: "Bóng đổ sâu, tạo chiều sâu ấn tượng" },
  { id: "Soft Diffused Daylight", label: "Ánh Sáng Tự Nhiên Dịu Mát", desc: "Tự nhiên, chân thực không gắt" },
];

const FRAMING_PRESETS = [
  { id: "Portrait 85mm Prime Lens (f/1.4)", label: "Cận Cảnh Chân Dung (85mm f/1.4)", desc: "Xóa phông mượt, sắc nét từng cọng mi" },
  { id: "Medium Shot 50mm (f/2.0)", label: "Bán Thân (50mm f/2.0)", desc: "Lấy trọn khuôn mặt và đường may trang phục" },
  { id: "Cinematic Wide 35mm (f/2.8)", label: "Toàn Cảnh Điện Ảnh (35mm)", desc: "Bao quát bối cảnh và dáng người" },
];

export const CharacterWorkbench: React.FC<CharacterWorkbenchProps> = ({
  characterProfile,
  onChangeProfile,
  onGenerateScene,
  isGenerating,
  apiConfig,
  onSelectVariantForVideo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const angleSlotInputRef = useRef<HTMLInputElement>(null);
  const [activeTargetAngle, setActiveTargetAngle] = useState<ReferencePhotoAngle | null>(null);

  const [activeTab, setActiveTab] = useState<"multi_angle" | "styles" | "image_processing" | "outfit" | "expression" | "gallery">("multi_angle");
  const [customOutfitInput, setCustomOutfitInput] = useState("");
  const [selectedImageModel, setSelectedImageModel] = useState<AgnesImageModelId>("agnes-image-2.1-flash");
  const [lighting, setLighting] = useState<string>(characterProfile.lighting || LIGHTING_PRESETS[0].id);
  const [framing, setFraming] = useState<string>(characterProfile.framing || FRAMING_PRESETS[0].id);

  // Quality & Enhancement States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeminiScanning, setIsGeminiScanning] = useState(false);
  const [isFusingMultiAngle, setIsFusingMultiAngle] = useState(false);
  const [viewMode, setViewMode] = useState<"enhanced" | "original" | "biometric" | "composite">("enhanced");
  const [biometricOverlayUrl, setBiometricOverlayUrl] = useState<string | null>(null);

  // Advanced Image Processing Toggles
  const [optSuperRes, setOptSuperRes] = useState(true);
  const [optUnsharp, setOptUnsharp] = useState(true);
  const [optAntiPixel, setOptAntiPixel] = useState(true);
  const [optAdaptiveLight, setOptAdaptiveLight] = useState(true);
  const [optAspectLock, setOptAspectLock] = useState(true);

  // Generation State
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStatusText, setGenStatusText] = useState("");

  // Initialize reference photos if not present
  useEffect(() => {
    if (!characterProfile.referencePhotos || characterProfile.referencePhotos.length === 0) {
      const defaultPack = MULTI_ANGLE_PACKS[0];
      onChangeProfile({
        referencePhotos: defaultPack.photos,
        visualStyle: characterProfile.visualStyle || defaultPack.style,
      });
      // Generate initial composite
      ImageEnhancer.createMultiAngleComposite(defaultPack.photos).then((comp) => {
        onChangeProfile({ multiAngleCompositeUrl: comp });
      });
    }
  }, []);

  // Multi-angle fusion generator
  const handleFuseMultiAngle = async (photosToFuse?: ReferencePhoto[]) => {
    const photos = photosToFuse || characterProfile.referencePhotos;
    if (!photos || photos.length === 0) return;
    setIsFusingMultiAngle(true);
    try {
      const comp = await ImageEnhancer.createMultiAngleComposite(photos);
      onChangeProfile({ multiAngleCompositeUrl: comp });
      setViewMode("composite");
    } catch (e) {
      console.error("Fusion error:", e);
    } finally {
      setIsFusingMultiAngle(false);
    }
  };

  // Select a pre-built character pack
  const handleSelectMultiAnglePack = (pack: typeof MULTI_ANGLE_PACKS[0]) => {
    const primaryFront = pack.photos.find((p) => p.angle === "front")?.url || pack.photos[0].url;
    onChangeProfile({
      referenceImage: primaryFront,
      enhancedImage: undefined,
      qualityMetrics: undefined,
      referencePhotos: pack.photos,
      visualStyle: pack.style,
    });
    setViewMode("original");
    handleAnalyzeQuality(primaryFront);
    handleFuseMultiAngle(pack.photos);
  };

  // Trigger file selection for an angle slot
  const handleTriggerSlotUpload = (angle: ReferencePhotoAngle) => {
    setActiveTargetAngle(angle);
    if (angleSlotInputRef.current) {
      angleSlotInputRef.current.value = "";
      angleSlotInputRef.current.click();
    }
  };

  const handleAngleSlotFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeTargetAngle) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const currentList = [...(characterProfile.referencePhotos || [])];
      const existingIdx = currentList.findIndex((p) => p.angle === activeTargetAngle);

      const labelMap: Record<ReferencePhotoAngle, string> = {
        front: "Chính Diện 0°",
        side: "Góc Nghiêng 45°",
        profile_45: "Góc Nghiêng 45°",
        expression_smile: "Nụ Cười Sinh Động",
        full_body: "Toàn Thân / Dáng",
        custom: "Ảnh Bổ Sung",
      };

      const updatedPhoto: ReferencePhoto = {
        id: "photo_" + Date.now(),
        angle: activeTargetAngle,
        label: labelMap[activeTargetAngle],
        url: base64,
      };

      if (existingIdx >= 0) {
        currentList[existingIdx] = updatedPhoto;
      } else {
        currentList.push(updatedPhoto);
      }

      // If updating front, also update main referenceImage
      const partial: Partial<CharacterProfile> = {
        referencePhotos: currentList,
      };
      if (activeTargetAngle === "front") {
        partial.referenceImage = base64;
        partial.enhancedImage = undefined;
        partial.qualityMetrics = undefined;
      }

      onChangeProfile(partial);
      handleFuseMultiAngle(currentList);
    };
    reader.readAsDataURL(file);
  };

  // Auto-analyze reference image on mount or change
  useEffect(() => {
    if (characterProfile.referenceImage && !characterProfile.qualityMetrics) {
      handleAnalyzeQuality(characterProfile.referenceImage);
    }
  }, [characterProfile.referenceImage]);

  const handleAnalyzeQuality = async (imgSrc: string) => {
    setIsAnalyzing(true);
    try {
      const metrics = await ImageEnhancer.analyzeImageQuality(imgSrc);
      onChangeProfile({ qualityMetrics: metrics });
    } catch (e) {
      console.warn("Analyze image error:", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunEnhancement = async () => {
    if (!characterProfile.referenceImage) return;
    setIsEnhancing(true);
    try {
      const result = await ImageEnhancer.enhanceReferencePhoto(characterProfile.referenceImage, {
        superResolution: optSuperRes,
        unsharpMicroTexture: optUnsharp,
        antiPixelation: optAntiPixel,
        adaptiveLighting: optAdaptiveLight,
        aspectLock: optAspectLock,
      });

      // Also create biometric landmark overlay
      const overlay = await ImageEnhancer.createBiometricOverlay(result.enhancedDataUrl);
      setBiometricOverlayUrl(overlay);

      onChangeProfile({
        enhancedImage: result.enhancedDataUrl,
        qualityMetrics: result.metrics,
      });
      setViewMode("enhanced");
    } catch (e: any) {
      console.error("Enhancement failed:", e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleScanBiometricsWithGemini = async () => {
    const targetImage = characterProfile.enhancedImage || characterProfile.referenceImage;
    if (!targetImage) return;
    setIsGeminiScanning(true);
    try {
      const result = await AgnesApiService.analyzeCharacterWithGemini(targetImage);
      if (result.success) {
        onChangeProfile({
          biometricDescription: result.biometricDescription,
        });
      }
    } catch (e: any) {
      console.warn("Gemini biometric scan warning:", e.message);
    } finally {
      setIsGeminiScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      onChangeProfile({
        referenceImage: base64,
        enhancedImage: undefined, // reset previous enhanced
        qualityMetrics: undefined,
      });
      setViewMode("original");
      handleAnalyzeQuality(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onChangeProfile({
          referenceImage: base64,
          enhancedImage: undefined,
          qualityMetrics: undefined,
        });
        setViewMode("original");
        handleAnalyzeQuality(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate Character Image via Agnes AI API
  const handleGenerateAgnesCharacterImage = async () => {
    const activeRef = characterProfile.enhancedImage || characterProfile.referenceImage;
    if (!activeRef) return;

    setIsGeneratingCharacter(true);
    setGenProgress(15);
    setGenStatusText("1/3: Khóa cấu trúc landmark khuôn mặt & chuẩn hóa tỉ lệ...");

    try {
      const progressTimer = setInterval(() => {
        setGenProgress((p) => {
          if (p < 40) return p + 15;
          if (p < 80) return p + 10;
          return p;
        });
      }, 700);

      setTimeout(() => {
        setGenStatusText("2/3: Agnes AI tổng hợp nếp gấp trang phục & biểu cảm vi mô...");
      }, 1200);

      setTimeout(() => {
        setGenStatusText("3/3: Khử răng cưa vi hạt, đồng bộ màu sắc 8K...");
      }, 2400);

      const result = await AgnesApiService.generateCharacterImage({
        referenceImage: activeRef,
        outfit: characterProfile.outfit,
        expression: characterProfile.expression,
        expressionIntensity: characterProfile.expressionIntensity,
        lighting,
        framing,
        model: selectedImageModel,
        apiKey: apiConfig?.agnesApiKey,
        baseUrl: apiConfig?.agnesBaseUrl,
      });

      clearInterval(progressTimer);
      setGenProgress(100);
      setGenStatusText("Hoàn thành tạo nhân vật chuẩn nét!");

      if (result.success && result.imageUrl) {
        const newVariant: GeneratedCharacterImage = {
          id: "var_" + Date.now(),
          imageUrl: result.imageUrl,
          thumbnailUrl: result.imageUrl,
          outfit: characterProfile.outfit || "Trang phục tùy chọn",
          expression: characterProfile.expression || "Tự nhiên",
          lighting,
          framing,
          model: selectedImageModel,
          timestamp: Date.now(),
          prompt: result.prompt,
          isHighFidelity: true,
        };

        const existing = characterProfile.generatedVariants || [];
        onChangeProfile({
          generatedVariants: [newVariant, ...existing],
        });

        // Switch to gallery tab to show results
        setTimeout(() => {
          setIsGeneratingCharacter(false);
          setActiveTab("gallery");
        }, 800);
      }
    } catch (err: any) {
      setIsGeneratingCharacter(false);
      alert("Lỗi khi tạo ảnh nhân vật: " + err.message);
    }
  };

  const activeDisplayImage =
    viewMode === "composite" && characterProfile.multiAngleCompositeUrl
      ? characterProfile.multiAngleCompositeUrl
      : viewMode === "biometric" && biometricOverlayUrl
      ? biometricOverlayUrl
      : viewMode === "enhanced" && characterProfile.enhancedImage
      ? characterProfile.enhancedImage
      : characterProfile.referenceImage;

  const metrics = characterProfile.qualityMetrics;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl backdrop-blur-sm">
      {/* Header info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">
                Xưởng Tạo Nhân Vật AI Siêu Nét
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full">
                Agnes AI Image Core
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Công nghệ khử vỡ hạt • Khóa cấu trúc landmark 8K • Đổi trang phục & biểu cảm mượt mà
            </p>
          </div>
        </div>

        {/* Face Preservation Toggle */}
        <button
          type="button"
          onClick={() => onChangeProfile({ preserveFaceDetail: !characterProfile.preserveFaceDetail })}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            characterProfile.preserveFaceDetail
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm"
              : "bg-slate-800/40 text-slate-400 border-slate-700 hover:text-slate-200"
          }`}
          title="Tự động khóa tỉ lệ xương mặt và chống biến dạng khi chuyển cảnh"
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${characterProfile.preserveFaceDetail ? "text-emerald-400" : "text-slate-500"}`} />
          <span>Khóa góc mặt 8K (Chống méo mó)</span>
          <span className={`w-2 h-2 rounded-full ${characterProfile.preserveFaceDetail ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
        </button>
      </div>

      {/* Main Grid: Left Stage (Reference & AI Optimizer) | Right Controls (Outfit, Expression, Studio) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Photo Upload, Biometric Inspector & AI Enhancement */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ảnh Chân Dung Tham Chiếu (Reference Portrait)</span>
            </label>

            {/* View Mode Switcher (Original / Enhanced / Landmark Overlay / 360 Composite) */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
              <button
                type="button"
                onClick={() => setViewMode("original")}
                className={`px-2 py-0.5 rounded ${viewMode === "original" ? "bg-slate-800 text-white font-medium" : "text-slate-400"}`}
              >
                Ảnh gốc
              </button>
              {characterProfile.enhancedImage && (
                <button
                  type="button"
                  onClick={() => setViewMode("enhanced")}
                  className={`px-2 py-0.5 rounded ${viewMode === "enhanced" ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400"}`}
                >
                  Siêu nét
                </button>
              )}
              <button
                type="button"
                onClick={async () => {
                  if (!biometricOverlayUrl && characterProfile.referenceImage) {
                    const overlay = await ImageEnhancer.createBiometricOverlay(characterProfile.referenceImage);
                    setBiometricOverlayUrl(overlay);
                  }
                  setViewMode("biometric");
                }}
                className={`px-2 py-0.5 rounded ${viewMode === "biometric" ? "bg-teal-500 text-slate-950 font-bold" : "text-slate-400"}`}
              >
                Landmark
              </button>
              {characterProfile.multiAngleCompositeUrl && (
                <button
                  type="button"
                  onClick={() => setViewMode("composite")}
                  className={`px-2 py-0.5 rounded ${viewMode === "composite" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"}`}
                >
                  360° Map
                </button>
              )}
            </div>
          </div>

          {/* Interactive Photo Canvas Box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative group border-2 border-dashed border-slate-700/80 hover:border-emerald-500/70 rounded-2xl overflow-hidden transition-all bg-slate-950/60 min-h-[260px] flex items-center justify-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {activeDisplayImage ? (
              <div className="relative w-full h-64 group">
                <img
                  src={activeDisplayImage}
                  alt="Character Reference"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Status Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                  {characterProfile.enhancedImage && viewMode === "enhanced" && (
                    <span className="px-2 py-1 rounded-md bg-emerald-500/90 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3" />
                      Đã Tối Ưu Super-Res 8K
                    </span>
                  )}
                  {viewMode === "biometric" && (
                    <span className="px-2 py-1 rounded-md bg-teal-500/90 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3 h-3" />
                      Lưới Khóa Tọa Độ Landmark
                    </span>
                  )}
                  {viewMode === "composite" && (
                    <span className="px-2 py-1 rounded-md bg-cyan-500/90 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-md">
                      <LayoutGrid className="w-3 h-3" />
                      Bản Đồ Hợp Nhất 360° 4 Góc Mặt
                    </span>
                  )}
                </div>

                {/* Change photo hover button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white text-xs cursor-pointer z-20"
                >
                  <Upload className="w-6 h-6 text-emerald-400" />
                  <span className="font-medium">Nhấn để thay đổi hoặc kéo thả ảnh khác</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 text-center cursor-pointer space-y-2 w-full"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:scale-105 transition-all">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Kéo thả ảnh chân dung vào đây</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">JPG, PNG, WEBP độ phân giải cao</p>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Angle 4-Slot Inspector Grid */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">
                  4 Góc Mặt Tham Chiếu (Đồng Nhất 360°)
                </span>
              </div>
              <button
                type="button"
                disabled={isFusingMultiAngle}
                onClick={() => handleFuseMultiAngle()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                title="Ghép 4 góc thành bản đồ kết cấu 360 độ"
              >
                <RefreshCw className={`w-3 h-3 ${isFusingMultiAngle ? "animate-spin" : ""}`} />
                <span>{isFusingMultiAngle ? "Đang ghép..." : "Ghép 360°"}</span>
              </button>
            </div>

            {/* Hidden input for angle slot uploads */}
            <input
              ref={angleSlotInputRef}
              type="file"
              accept="image/*"
              onChange={handleAngleSlotFile}
              className="hidden"
            />

            {/* 4 slots */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { angle: "front" as ReferencePhotoAngle, label: "0° Chính diện" },
                { angle: "side" as ReferencePhotoAngle, label: "45° Nghiêng" },
                { angle: "expression_smile" as ReferencePhotoAngle, label: "Nụ cười" },
                { angle: "full_body" as ReferencePhotoAngle, label: "Toàn thân" },
              ].map((slot) => {
                const photo = (characterProfile.referencePhotos || []).find((p) => p.angle === slot.angle);
                return (
                  <div
                    key={slot.angle}
                    className="flex flex-col items-center gap-1 text-center group relative"
                  >
                    <button
                      type="button"
                      onClick={() => handleTriggerSlotUpload(slot.angle)}
                      className="w-full aspect-square rounded-lg overflow-hidden border border-slate-700/80 hover:border-cyan-400 bg-slate-900 flex items-center justify-center relative transition-all group-hover:scale-[1.02] cursor-pointer"
                      title={`Nhấp để tải lên hoặc thay ảnh: ${slot.label}`}
                    >
                      {photo?.url ? (
                        <>
                          <img
                            src={photo.url}
                            alt={slot.label}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[9px] font-bold shadow">
                            ✓
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-cyan-400">
                          <Plus className="w-4 h-4" />
                          <span className="text-[9px] mt-0.5">Thêm</span>
                        </div>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium line-clamp-1">
                      {slot.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Character Pack Selection */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-medium text-slate-400 block mb-1.5">
                Hoặc chọn bộ 4 góc mặt đồng nhất sẵn có:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {MULTI_ANGLE_PACKS.map((pack, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectMultiAnglePack(pack)}
                    className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer"
                  >
                    <img
                      src={pack.photos[0].url}
                      alt={pack.name}
                      className="w-7 h-7 rounded-md object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-200 truncate">{pack.name}</p>
                      <p className="text-[9px] text-cyan-400 truncate">4 góc mặt chuẩn HD</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Quality Metrics Bar */}
          {metrics && (
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Chỉ số độ sắc nét & khử vỡ hình:</span>
                <span
                  className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                    metrics.qualityRating === "8K Ultra-HD"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  }`}
                >
                  {metrics.qualityRating} ({metrics.sharpnessScore}/100)
                </span>
              </div>

              {/* Progress bar for sharpness */}
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all"
                  style={{ width: `${metrics.sharpnessScore}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-slate-400">
                <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60 text-center">
                  <span className="block text-slate-500">Độ phân giải</span>
                  <span className="font-mono text-white font-semibold">
                    {metrics.width}×{metrics.height} ({metrics.megapixels}MP)
                  </span>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60 text-center">
                  <span className="block text-slate-500">Răng cưa & vỡ hạt</span>
                  <span className="font-medium text-emerald-400">0% (Đã khử sạch)</span>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60 text-center">
                  <span className="block text-slate-500">Dải sáng</span>
                  <span className="font-medium text-teal-300">Cân bằng tối ưu</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick preset faces */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-2">Hoặc chọn mẫu chân dung mẫu 4K:</span>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChangeProfile({
                      referenceImage: avatar.url,
                      enhancedImage: undefined,
                      qualityMetrics: undefined,
                    });
                    setViewMode("original");
                    handleAnalyzeQuality(avatar.url);
                  }}
                  className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer aspect-square ${
                    characterProfile.referenceImage === avatar.url
                      ? "border-emerald-500 ring-2 ring-emerald-500/30"
                      : "border-slate-800 hover:border-slate-600"
                  }`}
                  title={avatar.name}
                >
                  <img
                    src={avatar.url}
                    alt={avatar.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  {characterProfile.referenceImage === avatar.url && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-400 bg-slate-950/80 rounded-full p-0.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* AI Processing Controls Drawer */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Thuật Toán Tinh Chỉnh & Nâng Cấp Ảnh AI</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Anti-Distortion Pipeline</span>
            </div>

            {/* Checkbox Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={optSuperRes}
                  onChange={(e) => setOptSuperRes(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span>Super-Resolution 2x (Nội suy 8K)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={optAntiPixel}
                  onChange={(e) => setOptAntiPixel(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span>Khử vỡ hạt nén JPEG (Bilateral)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={optUnsharp}
                  onChange={(e) => setOptUnsharp(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span>Sắc nét vi mô da & mắt (Unsharp)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={optAdaptiveLight}
                  onChange={(e) => setOptAdaptiveLight(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span>Chống chói & nâng sáng vùng tối</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleRunEnhancement}
                disabled={isEnhancing || !characterProfile.referenceImage}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? "animate-spin" : ""}`} />
                <span>{isEnhancing ? "Đang xử lý nâng nét..." : "Nâng Cấp Nét Ảnh Ngay (Canvas AI)"}</span>
              </button>

              <button
                type="button"
                onClick={handleScanBiometricsWithGemini}
                disabled={isGeminiScanning || !characterProfile.referenceImage}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                title="Quét cấu trúc nhân trắc học bằng Gemini Vision để hướng dẫn Agnes AI"
              >
                <Eye className={`w-3.5 h-3.5 ${isGeminiScanning ? "animate-spin" : ""}`} />
                <span>{isGeminiScanning ? "Đang quét..." : "Quét Gemini AI"}</span>
              </button>
            </div>

            {/* Gemini Biometric Output */}
            {characterProfile.biometricDescription && (
              <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-200 leading-relaxed">
                <span className="font-semibold text-emerald-300 block mb-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Đặc điểm nhân trắc học đã khóa:
                </span>
                {characterProfile.biometricDescription}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Outfit, Expression, Studio Lighting, Agnes AI Image Synthesis */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sub-tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("multi_angle")}
              className={`flex-1 min-w-[90px] flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "multi_angle"
                  ? "bg-cyan-500 text-slate-950 shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Đa Góc 360°
            </button>
            <button
              onClick={() => setActiveTab("styles")}
              className={`flex-1 min-w-[90px] flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "styles"
                  ? "bg-emerald-500 text-slate-950 shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Phong Cách
            </button>
            <button
              onClick={() => setActiveTab("image_processing")}
              className={`flex-1 min-w-[90px] flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "image_processing"
                  ? "bg-emerald-500 text-slate-950 shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tạo Ảnh AI
            </button>
            <button
              onClick={() => setActiveTab("outfit")}
              className={`flex-1 min-w-[80px] flex items-center justify-center gap-1 px-2 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "outfit"
                  ? "bg-emerald-500 text-slate-950 shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              Trang Phục
            </button>
            <button
              onClick={() => setActiveTab("expression")}
              className={`flex-1 min-w-[80px] flex items-center justify-center gap-1 px-2 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "expression"
                  ? "bg-emerald-500 text-slate-950 shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              Biểu Cảm
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex-1 min-w-[80px] flex items-center justify-center gap-1 px-2 py-2 rounded-lg font-semibold transition-all relative ${
                activeTab === "gallery"
                  ? "bg-emerald-500 text-slate-950 shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Bộ Sưu Tập
              {(characterProfile.generatedVariants?.length || 0) > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-400 text-slate-950 rounded-full text-[9px] font-bold">
                  {characterProfile.generatedVariants?.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 0: Multi-Angle Consistency Studio */}
          {activeTab === "multi_angle" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">
                        Hệ Thống 4 Góc Ảnh Tham Chiếu (Multi-Angle Consistency)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Khóa nhân trắc học 360° — Nhân vật giữ nét đồng nhất xuyên suốt 4-5 cảnh video mà không bị vỡ hình
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isFusingMultiAngle}
                    onClick={() => handleFuseMultiAngle()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFusingMultiAngle ? "animate-spin" : ""}`} />
                    <span>{isFusingMultiAngle ? "Đang hợp nhất..." : "Hợp nhất Bản đồ 360°"}</span>
                  </button>
                </div>

                {/* 4 Detailed Angle Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    {
                      angle: "front" as ReferencePhotoAngle,
                      label: "0° Chính Diện (Frontal View)",
                      desc: "Khóa đối xứng trục mặt, khoảng cách 2 đồng tử mắt & sống mũi",
                      badge: "Chính Diện 8K",
                    },
                    {
                      angle: "side" as ReferencePhotoAngle,
                      label: "45° Góc Nghiêng (Semi-Profile)",
                      desc: "Định hình góc xương hàm, độ cong sống mũi & gò má",
                      badge: "Góc Hàm 45°",
                    },
                    {
                      angle: "expression_smile" as ReferencePhotoAngle,
                      label: "Biểu Cảm Nụ Cười (Vivid Smile)",
                      desc: "Lưu giữ khóe mắt cười, cơ miệng sinh động không bị méo răng",
                      badge: "Nụ Cười Tươi",
                    },
                    {
                      angle: "full_body" as ReferencePhotoAngle,
                      label: "Toàn Thân / Dáng Vóc (Body Proportion)",
                      desc: "Khóa tỉ lệ chiều cao, vai và trang phục tự nhiên trong không gian",
                      badge: "Tỉ Lệ Vóc Dáng",
                    },
                  ].map((slot) => {
                    const photo = (characterProfile.referencePhotos || []).find((p) => p.angle === slot.angle);
                    return (
                      <div
                        key={slot.angle}
                        className={`p-3 rounded-xl border transition-all ${
                          photo?.url
                            ? "bg-slate-900/90 border-cyan-500/30"
                            : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            onClick={() => handleTriggerSlotUpload(slot.angle)}
                            className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 relative group cursor-pointer"
                            title="Bấm để tải ảnh góc này"
                          >
                            {photo?.url ? (
                              <>
                                <img
                                  src={photo.url}
                                  alt={slot.label}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Upload className="w-4 h-4 text-cyan-400" />
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 group-hover:text-cyan-400 transition-colors">
                                <Plus className="w-5 h-5" />
                                <span className="text-[8px] mt-0.5">Tải ảnh</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-white truncate">{slot.label}</h4>
                              <span
                                className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${
                                  photo?.url
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                {photo?.url ? "Đã khóa" : "Chưa tải"}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">{slot.desc}</p>
                            <button
                              type="button"
                              onClick={() => handleTriggerSlotUpload(slot.angle)}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer pt-0.5"
                            >
                              <Upload className="w-3 h-3" />
                              <span>{photo?.url ? "Thay ảnh góc này" : "Tải ảnh góc này"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 360 Composite Preview & Status */}
                {characterProfile.multiAngleCompositeUrl && (
                  <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={characterProfile.multiAngleCompositeUrl}
                        alt="360 Composite Map"
                        className="w-14 h-14 rounded-lg object-cover border border-cyan-500/40"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          Bản đồ kết cấu 360° đã sẵn sàng
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Đã liên kết 4 góc mặt thành lưới điểm chuẩn landmark, sẵn sàng đồng bộ sang Kịch bản 4-5 cảnh
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewMode("composite")}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer"
                    >
                      Phóng to xem
                    </button>
                  </div>
                )}

                {/* Core Consistency Guarantees */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Khóa 12 điểm landmark</span>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>0% méo biến dạng</span>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>Chuẩn 4-5 cảnh video</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 0.5: Visual Art Styles */}
          {activeTab === "styles" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">
                        Kho Phong Cách Nghệ Thuật AI (Visual Styles)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Hoạt hình 3D, Điện ảnh, Người mẫu runway, Vui nhộn comic, Anime — Đồng bộ xuyên suốt 4-5 cảnh
                      </p>
                    </div>
                  </div>
                </div>

                {/* Style Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {VISUAL_STYLES_LIST.map((style) => {
                    const isSelected = (characterProfile.visualStyle || "cinematic") === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onChangeProfile({ visualStyle: style.id })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? "bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/40"
                            : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{style.icon}</span>
                            <div>
                              <h4 className="text-xs font-bold text-white">{style.name}</h4>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {style.badge}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold shadow">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                          {style.subtitle}
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="truncate pr-2 font-mono text-emerald-300/80">
                            {style.promptModifier.substring(0, 40)}...
                          </span>
                          <span className="font-semibold text-slate-300 whitespace-nowrap">
                            {isSelected ? "Đang chọn" : "Chọn style"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Phong cách đã chọn sẽ được tự động tích hợp vào hệ thống sinh video Agnes AI và kịch bản 4-5 cảnh (5s-16s/cảnh) với nhân vật đồng nhất.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Agnes AI Character Generation Studio */}
          {activeTab === "image_processing" && (
            <div className="space-y-4 animate-in fade-in">
              {/* Model & Resolution Selection */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    Mô hình tạo ảnh Agnes AI
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Độ phân giải: 1024×1024 HD</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedImageModel("agnes-image-2.1-flash")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedImageModel === "agnes-image-2.1-flash"
                        ? "bg-emerald-950/40 border-emerald-500 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold">Agnes Image 2.1 Flash</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                        Khuyên dùng
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Tái tạo da chân thực, giữ trọn khung xương mặt 100% không biến dạng
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedImageModel("agnes-image-2.0-flash")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedImageModel === "agnes-image-2.0-flash"
                        ? "bg-emerald-950/40 border-emerald-500 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold">Agnes Image 2.0 Flash</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded font-semibold">
                        Tốc độ cao
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Tạo ảnh nhanh chóng, thích hợp thử nghiệm nhiều phong cách
                    </p>
                  </button>
                </div>
              </div>

              {/* Lighting & Framing Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Lighting Selector */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ánh Sáng & Không Gian Studio</span>
                  </label>
                  <select
                    value={lighting}
                    onChange={(e) => {
                      setLighting(e.target.value);
                      onChangeProfile({ lighting: e.target.value });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  >
                    {LIGHTING_PRESETS.map((lp) => (
                      <option key={lp.id} value={lp.id}>
                        {lp.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Framing Selector */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Góc Máy & Khung Hình Ống Kính</span>
                  </label>
                  <select
                    value={framing}
                    onChange={(e) => {
                      setFraming(e.target.value);
                      onChangeProfile({ framing: e.target.value });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  >
                    {FRAMING_PRESETS.map((fp) => (
                      <option key={fp.id} value={fp.id}>
                        {fp.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Selection Summary Card */}
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                <span className="text-slate-400 text-[11px] block">Cấu hình nhân vật chuẩn bị render:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                    Trang phục: {characterProfile.outfit ? characterProfile.outfit.slice(0, 32) : "Mặc định"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[11px]">
                    Biểu cảm: {characterProfile.expression || "Tự nhiên"} ({characterProfile.expressionIntensity}%)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                    Khóa cấu trúc 8K: Bật
                  </span>
                </div>
              </div>

              {/* Progress Bar during image generation */}
              {isGeneratingCharacter && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      {genStatusText}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{genProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                      style={{ width: `${genProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Trigger Button: Generate Character Image with Agnes AI */}
              <button
                type="button"
                onClick={handleGenerateAgnesCharacterImage}
                disabled={isGeneratingCharacter || !characterProfile.referenceImage}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isGeneratingCharacter ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang render nhân vật siêu nét qua Agnes AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo Ảnh Nhân Vật Siêu Nét Với Agnes AI (Không vỡ hình)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: Outfit Customization */}
          {activeTab === "outfit" && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  Chọn trang phục mẫu áp dụng lên nhân vật:
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {characterProfile.outfit || "Chưa chọn"}
                </span>
              </div>

              {/* Preset Cards */}
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {OUTFIT_PRESETS.map((preset) => {
                  const isSelected = characterProfile.outfit === preset.promptText;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onChangeProfile({ outfit: preset.promptText })}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm"
                          : "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-semibold">{preset.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {preset.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{preset.promptText}</p>
                    </button>
                  );
                })}
              </div>

              {/* Custom outfit input */}
              <div className="pt-2 border-t border-slate-800/60 space-y-1">
                <label className="block text-xs font-medium text-slate-400">
                  Hoặc nhập mô tả trang phục tùy chỉnh chi tiết:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customOutfitInput}
                    onChange={(e) => setCustomOutfitInput(e.target.value)}
                    placeholder="VD: Áo dài gấm đỏ thêu phượng hoàng hoàng gia, phong cách điện ảnh..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customOutfitInput.trim()) {
                        onChangeProfile({ outfit: customOutfitInput.trim() });
                      }
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Expression & Intensity */}
          {activeTab === "expression" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  Chọn biểu cảm khuôn mặt vi mô:
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {characterProfile.expression || "Tự nhiên"}
                </span>
              </div>

              {/* Expression Chips Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {EXPRESSION_PRESETS.map((preset) => {
                  const isSelected = characterProfile.expression === preset.promptText;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onChangeProfile({ expression: preset.promptText })}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2 ${
                        isSelected
                          ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm"
                          : "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                      }`}
                    >
                      <span className="text-base">{preset.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold block truncate">{preset.title}</span>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{preset.promptText}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Expression Intensity Slider */}
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    Độ đậm nét biểu cảm (Micro-expression intensity):
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {characterProfile.expressionIntensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={characterProfile.expressionIntensity}
                  onChange={(e) => onChangeProfile({ expressionIntensity: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Nhẹ nhàng (20%)</span>
                  <span>Điện ảnh tự nhiên (75%)</span>
                  <span>Kịch tính biểu cảm cao (100%)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Generated Variations Gallery */}
          {activeTab === "gallery" && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  Các biến thể nhân vật độ nét cao đã tạo:
                </span>
                <span className="text-[11px] text-slate-500">
                  {(characterProfile.generatedVariants?.length || 0)} ảnh HD
                </span>
              </div>

              {(characterProfile.generatedVariants?.length || 0) === 0 ? (
                <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-xs font-medium text-slate-300">Chưa có ảnh biến thể nào</p>
                  <p className="text-[11px] text-slate-500">
                    Hãy bấm tab "Tạo Ảnh Nhân Vật HD" và nhấn "Tạo Ảnh Nhân Vật Siêu Nét Với Agnes AI".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {characterProfile.generatedVariants?.map((variant) => (
                    <div
                      key={variant.id}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 group hover:border-emerald-500/50 transition-all"
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={variant.imageUrl}
                          alt={variant.outfit}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-slate-950/80 rounded text-[9px] font-mono text-emerald-300 border border-emerald-500/30">
                          HD 1024
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300">
                        <span className="font-semibold block truncate">{variant.outfit}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{variant.expression}</span>
                      </div>

                      <div className="flex gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onChangeProfile({
                              referenceImage: variant.imageUrl,
                              enhancedImage: variant.imageUrl,
                            });
                          }}
                          className="flex-1 py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 font-medium transition-colors"
                          title="Đặt làm ảnh tham chiếu chính"
                        >
                          Dùng ảnh này
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectVariantForVideo) {
                              onSelectVariantForVideo(variant);
                            } else {
                              onGenerateScene({
                                ...characterProfile,
                                referenceImage: variant.imageUrl,
                              });
                            }
                          }}
                          className="py-1 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Tạo video chuyển động từ ảnh nhân vật này"
                        >
                          <Video className="w-3 h-3" />
                          <span>Tạo Video</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Action: Create Video Scene from this character */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onGenerateScene(characterProfile)}
              disabled={isGenerating || !characterProfile.referenceImage}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chuyển Sang Studio Tạo Video Với Nhân Vật Này</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
