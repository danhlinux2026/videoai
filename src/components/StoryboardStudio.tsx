import React, { useState, useRef, useEffect } from "react";
import {
  Film,
  Sparkles,
  Clock,
  Play,
  Pause,
  Square,
  CheckCircle2,
  Video,
  Camera,
  Shirt,
  Smile,
  Sliders,
  Plus,
  Trash2,
  RefreshCw,
  Zap,
  ArrowRight,
  ShieldCheck,
  Palette,
  Minus,
  Volume2,
  VolumeX,
  Mic,
  Upload,
  Globe,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Radio,
  Music,
  SlidersHorizontal,
  Compass,
  FileText,
  HelpCircle,
  Layers,
} from "lucide-react";
import {
  StoryboardScene,
  CharacterProfile,
  VisualStyleCategory,
  CameraMotion,
  VideoClip,
  ApiConfig,
  EdgeTtsSettings,
  VoicePersona,
  RhythmStyle,
} from "../types";
import { AgnesApiService } from "../services/agnesApi";
import { edgeTts, EDGE_TTS_VOICES, RHYTHM_STYLES, VoiceOption } from "../services/edgeTtsService";

interface StoryboardStudioProps {
  characterProfile: CharacterProfile;
  onChangeProfile: (updated: Partial<CharacterProfile>) => void;
  onSendToTimeline: (clips: VideoClip[]) => void;
  apiConfig: ApiConfig;
}

const VISUAL_STYLES: {
  id: VisualStyleCategory;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  badgeColor: string;
}[] = [
  {
    id: "cinematic",
    name: "Điện Ảnh (Cinematic 8K)",
    icon: "🎬",
    tagline: "Chân thực • Chi tiết da 8K • Ánh sáng phim trường",
    description: "Khung hình tỉ lệ vàng, góc quay 35mm sâu lắng, tái tạo tự nhiên không biến dạng.",
    badgeColor: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  },
  {
    id: "fashion_model",
    name: "Người Mẫu (Vogue Editorial)",
    icon: "📸",
    tagline: "High-Fashion • Sàn diễn • Lookbook thời thượng",
    description: "Tạo dáng chuyên nghiệp, tôn vinh chất liệu vải, ánh sáng studio softbox cao cấp.",
    badgeColor: "border-pink-500/40 bg-pink-500/10 text-pink-300",
  },
  {
    id: "3d_animation",
    name: "Hoạt Hình 3D (Pixar/Disney 3D)",
    icon: "🎨",
    tagline: "Hoạt họa 3D • Mắt sáng • Đồ họa điện toán",
    description: "Nhân vật cách điệu 3D mượt mà, da mịn màng, biểu cảm sinh động cuốn hút.",
    badgeColor: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  },
  {
    id: "playful_comic",
    name: "Vui Nhộn (Playful & Energetic)",
    icon: "🎭",
    tagline: "Hài hước • Tươi vui • Năng động tràn ngập",
    description: "Biểu cảm hóm hỉnh, nụ cười rạng rỡ, chuyển động bất ngờ và giàu năng lượng.",
    badgeColor: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  {
    id: "anime_aesthetic",
    name: "Anime Nghệ Thuật (Makoto Style)",
    icon: "🎌",
    tagline: "Anime Nhật Bản • Lãng mạn • Lung linh ánh sáng",
    description: "Nét vẽ anime trau chuốt, mắt long lanh cảm xúc, không gian mơ màng nên thơ.",
    badgeColor: "border-purple-500/40 bg-purple-500/10 text-purple-300",
  },
];

const CAMERA_MOTIONS: { id: CameraMotion; label: string }[] = [
  { id: "zoom_in", label: "Phóng gần (Zoom In)" },
  { id: "zoom_out", label: "Thu xa (Zoom Out)" },
  { id: "pan_left", label: "Lướt sang trái (Pan Left)" },
  { id: "pan_right", label: "Lướt sang phải (Pan Right)" },
  { id: "orbit_360", label: "Quay vòng quanh (Orbit 360°)" },
  { id: "tilt_up", label: "Chếch từ dưới lên (Tilt Up)" },
  { id: "tilt_down", label: "Góc từ trên xuống (Tilt Down)" },
  { id: "static", label: "Tĩnh trung tâm (Static Center)" },
];

const PRESET_STORYBOARD_THEMES = [
  {
    title: "Hành Trình Thời Trang Á Đông",
    theme: "Hành trình biến hóa phong cách trang phục Á Đông qua phố cổ và dạ tiệc hoàng hôn",
    style: "cinematic" as VisualStyleCategory,
  },
  {
    title: "Cyberpunk Siêu Tương Lai",
    theme: "Chiến binh dạo bước giữa thành phố tương lai rực rỡ ánh đèn neon và mưa bụi",
    style: "fashion_model" as VisualStyleCategory,
  },
  {
    title: "Chuyến Phiêu Lưu Hoạt Hình Vui Nhộn",
    theme: "Cuộc thám hiểm rừng hoa kỳ diệu với nhiều bất ngờ vui tươi, nụ cười rạng rỡ",
    style: "3d_animation" as VisualStyleCategory,
  },
  {
    title: "Nắng Hè Rực Rỡ & Năng Lượng Tươi Sáng",
    theme: "Kỳ nghỉ mùa hè trên bờ biển nhiệt đới, tạo dáng năng động, biểu cảm tươi vui",
    style: "playful_comic" as VisualStyleCategory,
  },
];

export const StoryboardStudio: React.FC<StoryboardStudioProps> = ({
  characterProfile,
  onChangeProfile,
  onSendToTimeline,
  apiConfig,
}) => {
  const [sceneCount, setSceneCount] = useState<4 | 5>(5);
  const [storyboardThemeInput, setStoryboardThemeInput] = useState(
    "Hành trình một ngày đầy năng lượng và biến hóa phong cách thời trang ấn tượng của nhân vật"
  );
  const [synopsis, setSynopsis] = useState<string>(
    "Kịch bản xuyên suốt 5 cảnh: Từ khởi đầu cận cảnh gương mặt rạng rỡ, dạo bước qua đại lộ đô thị, biến hóa trang phục dạ hội 360 độ kịch tính, bùng nổ nụ cười tự do và kết màn hoàng hôn sâu lắng."
  );
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isRenderingAll, setIsRenderingAll] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatusText, setRenderStatusText] = useState("");

  // Edge TTS Configuration State
  const [ttsSettings, setTtsSettings] = useState<EdgeTtsSettings>({
    voicePersona: "woman_gentle",
    speed: 1.0,
    pitch: 0,
    rhythmStyle: "storyteller",
    volume: 100,
  });
  const [showTtsPanel, setShowTtsPanel] = useState(true);
  const [activePlayingSceneIndex, setActivePlayingSceneIndex] = useState<number | null>(null);
  const [isFullScriptPlaying, setIsFullScriptPlaying] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [activeVoiceCategoryFilter, setActiveVoiceCategoryFilter] = useState<
    "all" | "child" | "elderly" | "woman" | "man" | "custom"
  >("all");
  const [isGeneratingVoiceForScene, setIsGeneratingVoiceForScene] = useState<number | null>(null);

  const customAudioInputRef = useRef<HTMLInputElement>(null);

  // Default initial 5 scenes adhering strictly to 5s-16s each with continuous narrative, voiceover and bilingual prompts
  const [scenes, setScenes] = useState<StoryboardScene[]>([
    {
      id: "sc_1",
      sceneNumber: 1,
      title: "Cảnh 1: Khởi Nguyên - Chân Dung & Ánh Nhìn Cuốn Hút",
      description:
        "Cận cảnh chân dung nhân vật với ánh nhìn điện ảnh sắc nét, nụ cười nhẹ tự tin chào ngày mới, ánh sáng mềm mại tôn trọn đường nét gương mặt.",
      duration: 6.5,
      cameraMotion: "zoom_in",
      outfitVariation: "Áo sơ mi lụa thanh lịch Haute Couture",
      expressionVariation: "Nụ cười tự tin, ánh mắt rạng rỡ có thần",
      voiceoverScript:
        "Mỗi ngày mới là một khởi đầu rực rỡ, nơi sự tự tin và đam mê biến từng khoảnh khắc thành điều kỳ diệu.",
      englishPrompt:
        "Cinematic 8k close-up portrait of an elegant character looking directly into the camera with confident radiant smile, soft 35mm anamorphic bokeh, three-point studio rim lighting, photorealistic skin pores and ultra-high texture details, slow smooth push in.",
      vietnameseNotes:
        "Góc cận cảnh mở màn chân dung: Ánh sáng viền dịu nhẹ, nụ cười tự tin nhìn thẳng máy quay, làm nổi bật đường nét gương mặt không bị méo mó.",
      characterActionPrompt:
        "Character gently turns head toward the camera, blinking softly with an inviting micro-smile, maintaining natural, relaxed shoulder posture.",
      characterActionNotes:
        "Hành động: Nhân vật khẽ nghiêng đầu nhìn vào ống kính, mắt chớp nhẹ tự nhiên, khóe môi hé nụ cười tươi tắn và vai thả lỏng tự tin.",
      contextEnvironmentPrompt:
        "Warm amber sunlit interior with architectural minimalist wood accents and soft morning rays refracting through sheer drapes.",
      contextEnvironmentNotes:
        "Bối cảnh: Căn phòng tối giản với điểm nhấn gỗ ấm áp, ánh nắng ban mai chiếu rọi qua rèm voan mỏng manh tạo cảm giác bình yên.",
      characterVfxPrompt:
        "Subtle warm golden rim light wrap, natural micro-smile flutter, eye catchlight reflection, biometric facial geometry lock.",
      characterVfxNotes:
        "Ánh vàng ấm viền quanh mái tóc, khóe môi khẽ cười tự nhiên, đốm sáng phản chiếu trong mắt, khóa 12 điểm mốc gương mặt 100%.",
      environmentPrompt:
        "Minimalist modern interior transitioning into soft morning city skyline bokeh, warm amber dusk atmosphere.",
      environmentNotes:
        "Không gian nội thất hiện đại tối giản với ánh sáng buổi sáng phản chiếu qua khung kính mờ ảo.",
      status: "ready",
      thumbnailUrl:
        characterProfile.referenceImage ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-neon-illuminated-city-43188-large.mp4",
    },
    {
      id: "sc_2",
      sceneNumber: 2,
      title: "Cảnh 2: Tương Tác & Sải Bước Đại Lộ Đô Thị",
      description:
        "Góc quay bán thân theo bước chân nhân vật tự tin sải bước qua đại lộ đô thị hiện đại, tà áo bay nhẹ trong làn gió nhẹ.",
      duration: 8.5,
      cameraMotion: "pan_right",
      outfitVariation: "Set đồ dạo phố Haute Couture hiện đại",
      expressionVariation: "Phong thái kiêu sa, cuốn hút",
      voiceoverScript:
        "Hòa nhịp vào phố thị sôi động, từng bước chân uyển chuyển vẽ nên phong cách độc bản không thể trộn lẫn.",
      englishPrompt:
        "Medium shot of the character walking gracefully through a vibrant metropolitan boulevard, stylish catwalk cadence, fabric flowing naturally with breeze, dynamic pan right tracking camera, rich depth of field, 8k resolution.",
      vietnameseNotes:
        "Góc quay bán thân theo bước chân dạo phố: Tà áo bay tự nhiên theo từng bước đi, máy quay lướt ngang mượt mà sang phải.",
      characterActionPrompt:
        "Character walks along the boulevard with a poised catwalk stride, one hand lightly brushing back hair, looking curiously at modern storefront displays.",
      characterActionNotes:
        "Hành động: Nhân vật sải bước tự tin trên đại lộ như trên sàn diễn, tay khẽ vuốt tóc, ánh mắt nhìn quanh các cửa hiệu hiện đại.",
      contextEnvironmentPrompt:
        "Urban bustling boulevard lined with reflective glass towers, golden late afternoon reflections and wet cobblestone highlights.",
      contextEnvironmentNotes:
        "Bối cảnh: Đại lộ sầm uất với các tòa tháp kính phản chiếu ánh chiều tà, vỉa hè lấp lánh phản quang tạo chiều sâu đô thị.",
      characterVfxPrompt:
        "Dynamic realistic cloth simulation, subtle kinetic motion blur on background, consistent facial landmarks preserved without jitter.",
      characterVfxNotes:
        "Mô phỏng tà áo bay tự nhiên theo chuyển động, làm mờ chuyển động hậu cảnh nhẹ nhàng, giữ vững nét mặt không rung lắc.",
      environmentPrompt:
        "Lively avenue lined with reflective glass facades and golden late afternoon sunlight, glistening pavements.",
      environmentNotes:
        "Đại lộ sầm uất với các tòa nhà kính hiện đại lấp lánh ánh nắng chiều vàng ấm áp.",
      status: "ready",
      thumbnailUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-walking-through-a-city-at-night-42888-large.mp4",
    },
    {
      id: "sc_3",
      sceneNumber: 3,
      title: "Cảnh 3: Cao Trào Cảm Xúc & Biến Hóa Dạ Hội 360°",
      description:
        "Góc quay vòng quanh 360 độ bắt trọn khoảnh khắc nhân vật biến hóa trang phục dạ hội lộng lẫy, biểu cảm kiên định đầy uy lực.",
      duration: 10.0,
      cameraMotion: "orbit_360",
      outfitVariation: "Váy dạ hội nhung đen đính pha lê lấp lánh",
      expressionVariation: "Ánh mắt sắc sảo, kiêu hãnh và quyết tâm",
      voiceoverScript:
        "Và khi ánh hào quang bừng sáng, vẻ đẹp nội lực và bản lĩnh kiên cường tỏa rạng, chinh phục mọi ánh nhìn.",
      englishPrompt:
        "Dynamic 360 orbit camera smoothly sweeping around the character showcasing an intense empowering expression, dramatic cinematic high-contrast lighting, volumetric godrays, slow motion feel, striking crystal embroidered dress.",
      vietnameseNotes:
        "Góc quay vòng quanh 360 độ: Ánh sáng điện ảnh kịch tính, chùm sáng khối rọi từ trên cao, tôn vinh bộ váy dạ hội đính đá lấp lánh.",
      characterActionPrompt:
        "Character halts mid-step, executing a slow dramatic spin with arms extended slightly, raising chin with fierce determination and commanding poise.",
      characterActionNotes:
        "Hành động: Nhân vật dừng bước, thực hiện cú xoay người chậm đầy nội lực, nâng cằm kiêu hãnh với ánh mắt sắc sảo làm chủ không gian.",
      contextEnvironmentPrompt:
        "Grand neoclassical rotunda with monumental stone arches, shafts of celestial volumetric light piercing through dust motes.",
      contextEnvironmentNotes:
        "Bối cảnh: Nhà vòm phong cách tân cổ điển với hàng cột đá hùng vĩ, luồng sáng xuyên qua không gian cổ kính đầy kịch tính.",
      characterVfxPrompt:
        "Volumetric atmospheric godrays, glittering light dust particles, dramatic contrast enhancement, razor-sharp facial symmetry.",
      characterVfxNotes:
        "Hiệu ứng tia sáng khối điện ảnh, các hạt bụi sáng li ti lấp lánh, tăng cường độ tương phản làm nổi bật đôi mắt sâu.",
      environmentPrompt:
        "Grand architectural rotunda with soaring arches, dramatic skylight beam piercing through theatrical fog.",
      environmentNotes:
        "Không gian vòm kiến trúc tráng lệ với các cột đá cổ điển và chùm sáng rọi qua làn sương mỏng.",
      status: "ready",
      thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-a-neon-lit-amusement-park-42897-large.mp4",
    },
    {
      id: "sc_4",
      sceneNumber: 4,
      title: "Cảnh 4: Hành Động Đột Phá & Nụ Cười Bừng Sáng",
      description:
        "Nhân vật quay lại nhìn vào ống kính và nở nụ cười rạng rỡ chân thật, ánh mắt lấp lánh niềm vui, không khí ấm áp ngập tràn sức sống.",
      duration: 7.5,
      cameraMotion: "zoom_out",
      outfitVariation: "Trang phục trẻ trung năng động hiện đại",
      expressionVariation: "Nụ cười rạng rỡ, hàm răng trắng tự nhiên",
      voiceoverScript:
        "Chẳng còn bất kỳ giới hạn nào. Niềm vui thuần khiết và tự do chính là kho báu quý giá nhất của cuộc sống.",
      englishPrompt:
        "Dynamic medium close-up of the character turning playfully toward the camera, breaking into an exuberant radiant genuine smile, hair tossed naturally by wind, energetic camera zoom out with vibrant saturated grading.",
      vietnameseNotes:
        "Góc máy trung cận quay ngoảnh lại: Nụ cười rạng rỡ tự nhiên, mái tóc tung bay trong gió nhẹ, camera lùi xa tạo cảm giác tự do.",
      characterActionPrompt:
        "Character spins around joyfully, laughing with open warmth, reaching one hand out playfully towards the viewer as wind catches their attire.",
      characterActionNotes:
        "Hành động: Nhân vật xoay người đón nhận niềm vui, nở nụ cười rạng rỡ đầy năng lượng, đưa tay về phía máy quay như gửi lời mời gọi.",
      contextEnvironmentPrompt:
        "Open-air rooftop terrace overlooking an endless city vista at magic hour, golden confetti and warm sunset breeze dancing in the air.",
      contextEnvironmentNotes:
        "Bối cảnh: Sân thượng trên cao nhìn ra toàn cảnh thành phố lúc hoàng hôn rực rỡ, gió chiều mang theo làn không khí ấm áp sảng khoái.",
      characterVfxPrompt:
        "Hair strand physics dynamics, micro-expression smile cheek lines, soft beauty aura flare, zero facial distortion.",
      characterVfxNotes:
        "Chuyển động sợi tóc bay mềm mại, khóe miệng cười tươi tắn, quầng sáng ấm tôn vinh làn da mịn màng.",
      environmentPrompt:
        "Sun-drenched scenic rooftop terrace overlooking panoramic city skyline, golden breeze and fluttering ribbons.",
      environmentNotes:
        "Sân thượng tràn ngập ánh nắng vàng nhìn ra toàn cảnh thành phố rực rỡ dưới bầu trời trong xanh.",
      status: "ready",
      thumbnailUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-in-a-studio-setting-42795-large.mp4",
    },
    {
      id: "sc_5",
      sceneNumber: 5,
      title: "Cảnh 5: Kết Màn Hoàng Hôn Điện Ảnh & Dấu Ấn Khó Quên",
      description:
        "Toàn cảnh nhân vật đứng trước khung cảnh hoàng hôn rực rỡ, ánh nắng vàng bao bọc đường viền mái tóc, khẽ vẫy tay chào đầy cảm xúc.",
      duration: 12.0,
      cameraMotion: "tilt_up",
      outfitVariation: "Trang phục kết màn thanh lịch quý phái",
      expressionVariation: "Ánh nhìn xa xăm, nụ cười ngọt ngào",
      voiceoverScript:
        "Một chương mới lại mở ra. Cảm ơn bạn đã đồng hành cùng hành trình rực rỡ này, hẹn gặp lại ở những khung hình tuyệt tác tiếp theo.",
      englishPrompt:
        "Grand cinematic wide shot of the character standing at a breathtaking sunset shoreline, gentle goodbye gesture, silhouette highlighted by blazing amber and violet skies, wide cinematic aspect ratio, filmic grain.",
      vietnameseNotes:
        "Toàn cảnh góc rộng hoàng hôn kết màn: Bầu trời nhuộm màu ráng chiều tím vàng lãng mạn, nhân vật vẫy tay chào đầy lắng đọng.",
      characterActionPrompt:
        "Character stands gracefully in profile by the water's edge, gazing out at the horizon, slowly turning back with a serene farewell nod.",
      characterActionNotes:
        "Hành động: Nhân vật đứng góc nghiêng bên bờ nước, phóng tầm mắt ra đường chân trời, khẽ quay lại gật đầu chào từ biệt đầy lắng đọng.",
      contextEnvironmentPrompt:
        "Expansive shoreline at twilight, calm ocean waves reflecting fiery magenta and amber clouds, peaceful dusk atmosphere.",
      contextEnvironmentNotes:
        "Bối cảnh: Bờ biển bao la lúc chập tối, từng đợt sóng êm đềm phản chiếu sắc mây đỏ hồng rực rỡ, bầu không khí điện ảnh yên bình.",
      characterVfxPrompt:
        "Golden hour contour silhouette edge, wind blowing cape and fabric gently, soft lens flare warmth.",
      characterVfxNotes:
        "Đường viền vàng cam bao quanh vóc dáng nhân vật, vạt áo lay động nhẹ theo gió chiều, ánh hào quang dịu ngọt.",
      environmentPrompt:
        "Tranquil ocean horizon reflecting fiery orange clouds and twilight dusk reflections, cinematic stillness.",
      environmentNotes:
        "Bờ biển tĩnh lặng phản chiếu ánh mây hoàng hôn đỏ rực, không gian điện ảnh sâu lắng.",
      status: "ready",
      thumbnailUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=85",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-walking-along-a-beach-at-sunset-41484-large.mp4",
    },
  ]);

  // Update a single scene field
  const handleUpdateScene = (index: number, updated: Partial<StoryboardScene>) => {
    setScenes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updated };
      return next;
    });
  };

  // Clamp duration between 5s and 16s
  const handleSceneDurationChange = (index: number, newDur: number) => {
    const clamped = Math.max(5.0, Math.min(16.0, Number(newDur.toFixed(1))));
    handleUpdateScene(index, { duration: clamped });
  };

  // Switch between 4 and 5 scenes
  const handleSetSceneCount = (count: 4 | 5) => {
    setSceneCount(count);
    if (count === 4 && scenes.length > 4) {
      setScenes(scenes.slice(0, 4));
    } else if (count === 5 && scenes.length === 4) {
      const scene5: StoryboardScene = {
        id: "sc_5_" + Date.now(),
        sceneNumber: 5,
        title: "Cảnh 5: Kết Màn Hoàng Hôn Điện Ảnh & Dấu Ấn Khó Quên",
        description:
          "Toàn cảnh nhân vật đứng trước khung cảnh hoàng hôn rực rỡ, ánh nắng vàng bao bọc đường viền mái tóc, khẽ vẫy tay chào đầy cảm xúc.",
        duration: 12.0,
        cameraMotion: "tilt_up",
        outfitVariation: "Trang phục kết màn thanh lịch quý phái",
        expressionVariation: "Ánh nhìn xa xăm, nụ cười ngọt ngào",
        voiceoverScript:
          "Một chương mới lại mở ra. Cảm ơn bạn đã đồng hành cùng hành trình rực rỡ này, hẹn gặp lại ở những khung hình tuyệt tác tiếp theo.",
        englishPrompt:
          "Grand cinematic wide shot of the character standing at a breathtaking sunset shoreline, gentle goodbye gesture, silhouette highlighted by blazing amber and violet skies, wide cinematic aspect ratio, filmic grain.",
        vietnameseNotes:
          "Toàn cảnh góc rộng hoàng hôn kết màn: Bầu trời nhuộm màu ráng chiều tím vàng lãng mạn, nhân vật vẫy tay chào đầy lắng đọng.",
        characterVfxPrompt:
          "Golden hour contour silhouette edge, wind blowing cape and fabric gently, soft lens flare warmth.",
        characterVfxNotes:
          "Đường viền vàng cam bao quanh vóc dáng nhân vật, vạt áo lay động nhẹ theo gió chiều, ánh hào quang dịu ngọt.",
        environmentPrompt:
          "Tranquil ocean horizon reflecting fiery orange clouds and twilight dusk reflections, cinematic stillness.",
        environmentNotes:
          "Bờ biển tĩnh lặng phản chiếu ánh mây hoàng hôn đỏ rực, không gian điện ảnh sâu lắng.",
        status: "ready",
        thumbnailUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=85",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-walking-along-a-beach-at-sunset-41484-large.mp4",
      };
      setScenes([...scenes, scene5]);
    }
  };

  // AI Storyboard generation with Gemini
  const handleGenerateScriptWithAI = async (customTheme?: string) => {
    const themeToUse = customTheme || storyboardThemeInput;
    setIsGeneratingScript(true);
    edgeTts.stopSpeaking();
    setActivePlayingSceneIndex(null);

    try {
      const result = await AgnesApiService.generateStoryboard({
        theme: themeToUse,
        visualStyle: characterProfile.visualStyle || "cinematic",
        sceneCount: sceneCount,
        characterDetails: characterProfile,
      });

      if (result && result.scenes && result.scenes.length > 0) {
        if (result.synopsis) setSynopsis(result.synopsis);

        // Map to StoryboardScene format ensuring 5s-16s duration constraint and bilingual fields
        const mappedScenes: StoryboardScene[] = result.scenes.slice(0, sceneCount).map((s, idx) => ({
          id: s.id || `sc_${idx + 1}_${Date.now()}`,
          sceneNumber: idx + 1,
          title: s.title || `Cảnh ${idx + 1}`,
          description: s.description || "",
          duration: Math.max(
            5.0,
            Math.min(
              16.0,
              Number(s.duration || (idx === 0 ? 6.5 : idx === 1 ? 8.5 : idx === 2 ? 10.0 : idx === 3 ? 7.5 : 12.0))
            )
          ),
          cameraMotion: s.cameraMotion || (idx === 0 ? "zoom_in" : idx === 1 ? "pan_right" : idx === 2 ? "orbit_360" : "zoom_out"),
          outfitVariation: s.outfitVariation || characterProfile.outfit,
          expressionVariation: s.expressionVariation || characterProfile.expression,
          voiceoverScript:
            s.voiceoverScript ||
            `Chào mừng bạn đến với phân cảnh ${idx + 1}, cảm xúc được dẫn dắt liền mạch và tự nhiên.`,
          englishPrompt:
            s.englishPrompt ||
            `Cinematic 8k shot of a consistent character in ${characterProfile.visualStyle} style, detailed 35mm lens, scene ${idx + 1}`,
          vietnameseNotes:
            s.vietnameseNotes ||
            `Cảnh ${idx + 1}: Chân dung điện ảnh sắc nét, ánh sáng hài hòa theo phong cách ${characterProfile.visualStyle}.`,
          characterActionPrompt:
            s.characterActionPrompt ||
            `Character maintains steady posture, engaging naturally with the camera in scene ${idx + 1}.`,
          characterActionNotes:
            s.characterActionNotes ||
            `Hành động: Nhân vật giữ phong thái tự tin, tương tác tự nhiên với góc quay cảnh ${idx + 1}.`,
          contextEnvironmentPrompt:
            s.contextEnvironmentPrompt ||
            `Atmospheric setting with rich depth of field and harmonic cinematic lighting.`,
          contextEnvironmentNotes:
            s.contextEnvironmentNotes ||
            `Bối cảnh: Chiều sâu trường ảnh mượt mà, ánh sáng hài hòa làm nổi bật chủ thể.`,
          characterVfxPrompt:
            s.characterVfxPrompt ||
            "Golden rim light wrap, realistic hair dynamics, biometric landmark lock 100%, sharp facial geometry.",
          characterVfxNotes:
            s.characterVfxNotes || "Hiệu ứng viền sáng tôn vinh nét mặt, khóa đối xứng nhân trắc học chống méo mó.",
          environmentPrompt:
            s.environmentPrompt || "Cinematic atmosphere with soft atmospheric mist and natural lighting.",
          environmentNotes:
            s.environmentNotes || "Bối cảnh điện ảnh mềm mại với chiều sâu trường ảnh tự nhiên.",
          status: "ready",
          thumbnailUrl:
            characterProfile.referenceImage ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85",
          videoUrl:
            idx % 2 === 0
              ? "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-neon-illuminated-city-43188-large.mp4"
              : "https://assets.mixkit.co/videos/preview/mixkit-young-woman-walking-through-a-city-at-night-42888-large.mp4",
        }));

        setScenes(mappedScenes);
      }
    } catch (err: any) {
      console.error("Storyboard gen error:", err);
      alert("Đã áp dụng mẫu kịch bản liền mạch chuẩn 4-5 cảnh: " + err.message);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Play voiceover for a single scene using Edge TTS
  const handlePlaySceneVoiceover = (index: number) => {
    const scene = scenes[index];
    if (!scene.voiceoverScript) return;

    if (activePlayingSceneIndex === index) {
      edgeTts.stopSpeaking();
      setActivePlayingSceneIndex(null);
      return;
    }

    setActivePlayingSceneIndex(index);
    edgeTts.speakWebSpeech(
      scene.voiceoverScript,
      ttsSettings,
      () => {},
      () => setActivePlayingSceneIndex(null),
      () => setActivePlayingSceneIndex(null)
    );
  };

  // Generate audio file / track for this scene using Edge TTS
  const handleSynthesizeSceneAudio = async (index: number) => {
    const scene = scenes[index];
    if (!scene.voiceoverScript) return;

    setIsGeneratingVoiceForScene(index);
    try {
      const { audioUrl } = await edgeTts.synthesizeSceneVoiceover(scene.voiceoverScript, ttsSettings);
      handleUpdateScene(index, { voiceoverAudioUrl: audioUrl });
    } catch (e: any) {
      console.error("TTS synth error:", e);
    } finally {
      setIsGeneratingVoiceForScene(null);
    }
  };

  // Play continuous voiceover across all 4-5 scenes in sequence!
  const handlePlayFullScript = () => {
    if (isFullScriptPlaying) {
      edgeTts.stopSpeaking();
      setIsFullScriptPlaying(false);
      setActivePlayingSceneIndex(null);
      return;
    }

    setIsFullScriptPlaying(true);
    let currentIndex = 0;

    const playNext = () => {
      if (currentIndex >= scenes.length) {
        setIsFullScriptPlaying(false);
        setActivePlayingSceneIndex(null);
        return;
      }

      setActivePlayingSceneIndex(currentIndex);
      const text = scenes[currentIndex].voiceoverScript || scenes[currentIndex].description;
      edgeTts.speakWebSpeech(
        text,
        ttsSettings,
        () => {},
        () => {
          currentIndex++;
          setTimeout(playNext, 600); // Short dramatic breath pause between scenes
        },
        () => {
          setIsFullScriptPlaying(false);
          setActivePlayingSceneIndex(null);
        }
      );
    };

    playNext();
  };

  // Handle uploading custom audio / voice file
  const handleCustomVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setTtsSettings((prev) => ({
      ...prev,
      voicePersona: "custom_upload",
      customAudioUrl: url,
      customAudioName: file.name,
    }));
  };

  // Copy English AI Prompt with or without Vietnamese notes
  const handleCopyPrompt = (promptText: string, id: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  // Push all 4-5 scenes directly into the timeline with their voiceover tracks and bilingual prompts
  const handleExportAllToTimeline = async () => {
    setIsRenderingAll(true);
    setRenderProgress(10);
    setRenderStatusText(`Đang đồng bộ hóa nhân vật đa góc mặt & lời thoại cho ${scenes.length} cảnh...`);

    const sampleVideos = [
      "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-neon-illuminated-city-43188-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-young-woman-walking-through-a-city-at-night-42888-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-a-neon-lit-amusement-park-42897-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-in-a-studio-setting-42795-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-girl-walking-along-a-beach-at-sunset-41484-large.mp4",
    ];

    try {
      for (let i = 1; i <= scenes.length; i++) {
        setRenderProgress(Math.round((i / scenes.length) * 85));
        setRenderStatusText(`Đang kết xuất Cảnh ${i}/${scenes.length}: ${scenes[i - 1].title}...`);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setRenderProgress(100);
      setRenderStatusText("Hoàn tất kết xuất chuỗi 4-5 cảnh kèm thuyết minh! Đang chuyển vào timeline...");

      // Convert scenes to VideoClip array
      const clips: VideoClip[] = scenes.map((sc, idx) => ({
        id: "clip_sc_" + idx + "_" + Date.now(),
        title: sc.title,
        duration: sc.duration,
        prompt: sc.englishPrompt || sc.description,
        model: "agnes-video-2.0-flash",
        sceneIndex: idx + 1,
        visualStyle: characterProfile.visualStyle,
        voiceoverScript: sc.voiceoverScript,
        voiceoverAudioUrl: sc.voiceoverAudioUrl,
        englishPrompt: sc.englishPrompt,
        vietnameseNotes: sc.vietnameseNotes,
        characterActionPrompt: sc.characterActionPrompt,
        characterActionNotes: sc.characterActionNotes,
        contextEnvironmentPrompt: sc.contextEnvironmentPrompt,
        contextEnvironmentNotes: sc.contextEnvironmentNotes,
        characterProfile: {
          ...characterProfile,
          outfit: sc.outfitVariation || characterProfile.outfit,
          expression: sc.expressionVariation || characterProfile.expression,
        },
        thumbnailUrl:
          sc.thumbnailUrl ||
          characterProfile.referenceImage ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85",
        videoUrl: sc.videoUrl || sampleVideos[idx % sampleVideos.length],
        transitionToNext:
          idx < scenes.length - 1
            ? {
                type: idx === 1 ? "whip_pan" : idx === 2 ? "zoom_in" : "crossfade",
                duration: 0.6,
              }
            : undefined,
      }));

      setTimeout(() => {
        onSendToTimeline(clips);
        setIsRenderingAll(false);
      }, 600);
    } catch (e: any) {
      setIsRenderingAll(false);
      alert("Lỗi xuất timeline: " + e.message);
    }
  };

  const totalStoryboardDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  const filteredVoices =
    activeVoiceCategoryFilter === "all"
      ? EDGE_TTS_VOICES
      : EDGE_TTS_VOICES.filter((v) => v.category === activeVoiceCategoryFilter);

  const selectedVoice = EDGE_TTS_VOICES.find((v) => v.id === ttsSettings.voicePersona) || EDGE_TTS_VOICES[0];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl backdrop-blur-sm">
      {/* Header with Visual Style & Consistency Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">
                Studio Kịch Bản Video 4-5 Cảnh Xuyên Suốt & Lồng Tiếng Edge TTS
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                Khóa 360° Đa Góc Mặt
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Kịch bản liền mạch xuyên suốt • Lồng tiếng từ kịch bản (Trẻ con, Người già, Phụ nữ) • Prompt tiếng Anh kèm ghi chú tiếng Việt
            </p>
          </div>
        </div>

        {/* 4 Cảnh vs 5 Cảnh Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Số lượng cảnh:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleSetSceneCount(4)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sceneCount === 4
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              4 Cảnh
            </button>
            <button
              type="button"
              onClick={() => handleSetSceneCount(5)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sceneCount === 5
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              5 Cảnh (Khuyên Dùng)
            </button>
          </div>
        </div>
      </div>

      {/* Visual Style Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chọn Phong Cách Video (Visual Style Category):</span>
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            Đồng bộ màu sắc & phong cách trên mọi cảnh
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {VISUAL_STYLES.map((style) => {
            const isSelected = characterProfile.visualStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChangeProfile({ visualStyle: style.id })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-800/90 border-cyan-400 shadow-md ring-1 ring-cyan-400/50"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{style.icon}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5 leading-tight">{style.name}</h4>
                  <p className="text-[10px] text-cyan-400/90 font-medium mt-0.5">{style.tagline}</p>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {style.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Narrative Arc Banner (Cốt truyện xuyên suốt) */}
      <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Cốt Truyện Xuyên Suốt (Continuous Narrative Arc - {scenes.length} Cảnh)
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Mạch truyện liền mạch
          </span>
        </div>

        {/* 5-Step Story Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 pt-1">
          {scenes.map((s, idx) => (
            <div
              key={s.id}
              className={`p-2.5 rounded-xl border transition-all ${
                activePlayingSceneIndex === idx
                  ? "border-cyan-400 bg-cyan-950/40 shadow-md ring-1 ring-cyan-400/40"
                  : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span className="font-mono font-bold text-cyan-400">CẢNH {idx + 1}</span>
                <span className="text-slate-500 font-mono">{s.duration.toFixed(1)}s</span>
              </div>
              <p className="text-[11px] font-bold text-slate-200 line-clamp-1">{s.title.replace(/^Cảnh \d+:?\s*/, "")}</p>
              <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 italic">
                "{s.voiceoverScript || s.description}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Script Theme Input & AI Generation */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ý tưởng hoặc chủ đề kịch bản muốn tạo:</span>
          </span>
          <span className="text-[10px] text-slate-500">
            AI sẽ tự động soạn lời thoại tiếng Việt & prompt tiếng Anh
          </span>
        </label>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <input
            type="text"
            value={storyboardThemeInput}
            onChange={(e) => setStoryboardThemeInput(e.target.value)}
            placeholder="Nhập chủ đề video (ví dụ: Hành trình biến hóa phong cách trang phục Á Đông qua phố cổ và dạ tiệc hoàng hôn)..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-500"
          />

          <button
            type="button"
            onClick={() => handleGenerateScriptWithAI()}
            disabled={isGeneratingScript}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingScript ? "animate-spin" : ""}`} />
            <span>{isGeneratingScript ? "Đang soạn kịch bản..." : "Tự Động Soạn Kịch Bản Xuyên Suốt"}</span>
          </button>
        </div>

        {/* Quick Idea Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] text-slate-500">Mẫu kịch bản gợi ý:</span>
          {PRESET_STORYBOARD_THEMES.map((theme, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setStoryboardThemeInput(theme.theme);
                onChangeProfile({ visualStyle: theme.style });
                handleGenerateScriptWithAI(theme.theme);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-800 transition-colors cursor-pointer"
            >
              {theme.title}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EDGE TTS VOICE & DUBBING STUDIO PANEL (Trẻ con, Người già, Phụ nữ, Upload) */}
      {/* ========================================================================= */}
      <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-4 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white tracking-wide">
                  Xưởng Lồng Tiếng & Giọng Đọc Kịch Bản (Edge TTS Engine)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Lấy Lời Thoại Từ Kịch Bản
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Đa dạng mẫu giọng: Trẻ con • Người già • Phụ nữ • Nam giới • Tải lên file riêng • Tùy biến tone nhanh/chậm & trầm/bổng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Play/Stop full continuous voiceover */}
            <button
              type="button"
              onClick={handlePlayFullScript}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isFullScriptPlaying
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              }`}
            >
              {isFullScriptPlaying ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isFullScriptPlaying ? "Dừng Đọc Kịch Bản" : "Nghe Toàn Bộ Lời Thoại 5 Cảnh"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTtsPanel(!showTtsPanel)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Thu gọn/Mở rộng bảng tùy chỉnh âm thanh"
            >
              {showTtsPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showTtsPanel && (
          <div className="space-y-4 pt-1">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Nhóm giọng:</span>
                {[
                  { id: "all", label: "Tất cả mẫu giọng" },
                  { id: "child", label: "👦 Trẻ con" },
                  { id: "elderly", label: "👴 Người già" },
                  { id: "woman", label: "👩 Phụ nữ" },
                  { id: "man", label: "👨 Nam giới" },
                  { id: "custom", label: "🎙️ Tải lên riêng" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveVoiceCategoryFilter(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                      activeVoiceCategoryFilter === cat.id
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Upload Custom Audio Button */}
              <div>
                <input
                  ref={customAudioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleCustomVoiceUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => customAudioInputRef.current?.click()}
                  className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Tải File Giọng Riêng (MP3/WAV/M4A)</span>
                </button>
              </div>
            </div>

            {/* Voice Cards Carousel/Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {filteredVoices.map((voice) => {
                const isSelected = ttsSettings.voicePersona === voice.id;
                return (
                  <button
                    key={voice.id}
                    type="button"
                    onClick={() => {
                      setTtsSettings((prev) => ({
                        ...prev,
                        voicePersona: voice.id,
                        speed: voice.defaultSpeed,
                        pitch: voice.defaultPitch,
                      }));
                      // Test play short greeting
                      edgeTts.speakWebSpeech(
                        voice.category === "child"
                          ? "Dạ con chào cô chú, con là " + voice.name
                          : voice.category === "elderly"
                          ? "Chào các cháu, ta là " + voice.name
                          : "Xin chào bạn, tôi là " + voice.name,
                        { ...ttsSettings, voicePersona: voice.id }
                      );
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-slate-800/90 border-emerald-400 shadow-md ring-1 ring-emerald-400/40"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{voice.avatar}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                            isSelected ? "bg-emerald-400 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {voice.categoryLabel}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1.5">{voice.name}</h4>
                      <p className="text-[10px] text-emerald-300/90 font-medium">{voice.tag}</p>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {voice.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                      <span className="font-mono text-cyan-400/80">{voice.edgeVoiceName}</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                        <Volume2 className="w-2.5 h-2.5" /> Thử giọng
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Voice Tone Sliders: Tone Nhanh Chậm, Trầm Bổng, Nhịp Điệu Tùy Chỉnh */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              {/* Speed / Tone Nhanh Chậm Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Tone Nhanh / Chậm (Speed):</span>
                  </label>
                  <span className="font-mono text-[11px] text-cyan-300 font-bold">
                    {ttsSettings.speed.toFixed(2)}x (
                    {ttsSettings.speed >= 1.0
                      ? `+${Math.round((ttsSettings.speed - 1) * 100)}%`
                      : `${Math.round((ttsSettings.speed - 1) * 100)}%`}
                    )
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={ttsSettings.speed}
                  onChange={(e) =>
                    setTtsSettings((prev) => ({ ...prev, speed: parseFloat(e.target.value) }))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>0.5x Chậm rãi</span>
                  <span>1.0x Tiêu chuẩn</span>
                  <span>2.0x Nhanh dồn dập</span>
                </div>
              </div>

              {/* Pitch / Trầm Bổng Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
                    <span>Cao Độ Trầm / Bổng (Pitch):</span>
                  </label>
                  <span className="font-mono text-[11px] text-emerald-300 font-bold">
                    {ttsSettings.pitch > 0 ? `+${ttsSettings.pitch}` : ttsSettings.pitch} st
                  </span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="1"
                  value={ttsSettings.pitch}
                  onChange={(e) =>
                    setTtsSettings((prev) => ({ ...prev, pitch: parseInt(e.target.value, 10) }))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>-10 Trầm ấm</span>
                  <span>0 Tự nhiên</span>
                  <span>+10 Bổng trong</span>
                </div>
              </div>

              {/* Rhythm Style / Nhịp Điệu Tùy Chỉnh */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <Music className="w-3 h-3 text-purple-400" />
                  <span>Nhịp Điệu Tùy Chỉnh (Prosody):</span>
                </label>
                <select
                  value={ttsSettings.rhythmStyle}
                  onChange={(e) =>
                    setTtsSettings((prev) => ({ ...prev, rhythmStyle: e.target.value as RhythmStyle }))
                  }
                  className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {RHYTHM_STYLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.icon} {r.label}
                    </option>
                  ))}
                </select>
                <p className="text-[9px] text-slate-400 italic truncate">
                  {RHYTHM_STYLES.find((r) => r.id === ttsSettings.rhythmStyle)?.desc}
                </p>
              </div>
            </div>

            {/* Custom Upload Audio Notification */}
            {ttsSettings.customAudioUrl && (
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-cyan-300 font-medium">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Đang sử dụng tệp giọng nói riêng: {ttsSettings.customAudioName || "Custom_Audio.mp3"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => edgeTts.speakWebSpeech("", ttsSettings)}
                  className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[10px]"
                >
                  Nghe Thử Tệp Tải Lên
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render Progress Modal/Banner */}
      {isRenderingAll && (
        <div className="p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-2xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              {renderStatusText}
            </span>
            <span className="font-mono">{renderProgress}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${renderProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4-5 SCENES INTERACTIVE LIST (Continuous Script + Voiceover + Bilingual Prompts) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-2">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>Danh Sách {scenes.length} Cảnh Trong Video (Tổng: {totalStoryboardDuration.toFixed(1)}s)</span>
          </span>
          <span className="text-[10px] text-slate-400">
            Prompt tiếng Anh xuất AI • Ghi chú tiếng Việt giải thích • Lời thoại trích xuất từ kịch bản
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {scenes.map((scene, index) => {
            const isPlayingThisScene = activePlayingSceneIndex === index;
            const isGeneratingVoice = isGeneratingVoiceForScene === index;

            return (
              <div
                key={scene.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700/90 rounded-2xl p-4 transition-all space-y-3.5"
              >
                {/* Scene Card Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={scene.title}
                      onChange={(e) => handleUpdateScene(index, { title: e.target.value })}
                      className="font-bold text-xs text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none px-1 py-0.5 max-w-sm sm:max-w-md"
                    />
                  </div>

                  {/* Scene Duration & Camera Controls */}
                  <div className="flex items-center gap-2">
                    {/* Duration Controller (5s - 16s) */}
                    <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        Độ dài:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSceneDurationChange(index, scene.duration - 0.5)}
                        disabled={scene.duration <= 5.0}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        title="Giảm 0.5s"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="font-mono font-bold text-xs text-cyan-300 px-1">
                        {scene.duration.toFixed(1)}s
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSceneDurationChange(index, scene.duration + 0.5)}
                        disabled={scene.duration >= 16.0}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        title="Tăng 0.5s"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    {/* Camera Select */}
                    <select
                      value={scene.cameraMotion}
                      onChange={(e) => handleUpdateScene(index, { cameraMotion: e.target.value as CameraMotion })}
                      className="px-2 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-400"
                    >
                      {CAMERA_MOTIONS.map((cm) => (
                        <option key={cm.id} value={cm.id}>
                          {cm.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
                  {/* Left: Thumbnail Preview (3 cols) */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="h-32 rounded-xl overflow-hidden relative group border border-slate-800 bg-slate-900">
                      <img
                        src={scene.thumbnailUrl}
                        alt={scene.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-950/90 text-[9px] font-mono text-cyan-300 border border-cyan-500/40">
                        Cảnh {index + 1} ({scene.duration.toFixed(1)}s)
                      </div>
                    </div>

                    {/* Quick outfit info */}
                    <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                        <Shirt className="w-3 h-3 text-cyan-400" />
                        <span>Trang phục cảnh:</span>
                      </div>
                      <input
                        type="text"
                        value={scene.outfitVariation || ""}
                        onChange={(e) => handleUpdateScene(index, { outfitVariation: e.target.value })}
                        placeholder="Mặc định theo hồ sơ..."
                        className="w-full px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Middle: Lời Thoại / Thuyết Minh Kịch Bản & Edge TTS (5 cols) */}
                  <div className="lg:col-span-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                        <Mic className="w-3 h-3" />
                        <span>Lời Thoại / Thuyết Minh (Voiceover):</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handlePlaySceneVoiceover(index)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors ${
                            isPlayingThisScene
                              ? "bg-rose-500 text-white animate-pulse"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                          }`}
                        >
                          {isPlayingThisScene ? <Square className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                          <span>{isPlayingThisScene ? "Dừng" : "Phát Lời Thoại"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSynthesizeSceneAudio(index)}
                          disabled={isGeneratingVoice}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1"
                          title="Tạo file âm thanh riêng cho cảnh này"
                        >
                          <Volume2 className="w-2.5 h-2.5 text-cyan-400" />
                          <span>{isGeneratingVoice ? "Đang tạo..." : "Lưu File"}</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={scene.voiceoverScript || ""}
                      onChange={(e) => handleUpdateScene(index, { voiceoverScript: e.target.value })}
                      placeholder="Nhập lời thoại hoặc lời bình tiếng Việt cho cảnh này..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-200 focus:outline-none focus:border-emerald-400 resize-none leading-relaxed placeholder:text-slate-600"
                    />

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Giọng đọc: {selectedVoice.name} ({ttsSettings.speed}x)</span>
                      {scene.voiceoverAudioUrl && (
                        <span className="text-cyan-400 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Đã tạo tệp âm thanh
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Bilingual Prompt System (English Prompt + Ghi chú tiếng Việt) (5 cols) */}
                  <div className="lg:col-span-5 space-y-2.5">
                    {/* Prompt Xuất AI (Tiếng Anh) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-cyan-300 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-cyan-400" />
                          <span>AI Prompt Video & Bối Cảnh (English Output):</span>
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyPrompt(scene.englishPrompt || scene.description, `prompt_${index}`)
                          }
                          className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          {copiedPromptId === `prompt_${index}` ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Đã chép!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span>Chép prompt EN</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={scene.englishPrompt || scene.description}
                        onChange={(e) => handleUpdateScene(index, { englishPrompt: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-cyan-200 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Ghi Chú Tiếng Việt Giải Thích & Chỉnh Sửa */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-amber-400" />
                          <span>Ghi Chú Tiếng Việt (Giải Thích & Hướng Dẫn Tùy Chỉnh):</span>
                        </label>
                      </div>
                      <textarea
                        rows={2}
                        value={scene.vietnameseNotes || scene.description}
                        onChange={(e) => handleUpdateScene(index, { vietnameseNotes: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Hiệu ứng nhân vật & Bối cảnh thu nhỏ */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900 text-[10px]">
                      <div className="p-2 rounded-lg bg-slate-900/50 border border-purple-500/20 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-300 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                            <span>Hành động & Cử chỉ nhân vật:</span>
                          </span>
                          <span className="text-[9px] text-purple-400/80 font-mono">Action</span>
                        </div>
                        <p className="text-[10px] text-slate-200 leading-snug">
                          {scene.characterActionNotes || scene.characterVfxNotes || "Nhân vật duy trì cử chỉ tự nhiên, thần thái tự tin làm chủ khung hình."}
                        </p>
                        {scene.characterActionPrompt && (
                          <p className="text-[9px] text-cyan-300/80 font-mono line-clamp-1 italic">
                            EN: {scene.characterActionPrompt}
                          </p>
                        )}
                      </div>

                      <div className="p-2 rounded-lg bg-slate-900/50 border border-teal-500/20 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-teal-300 flex items-center gap-1">
                            <Layers className="w-2.5 h-2.5 text-teal-400" />
                            <span>Bối cảnh & Không gian:</span>
                          </span>
                          <span className="text-[9px] text-teal-400/80 font-mono">Context</span>
                        </div>
                        <p className="text-[10px] text-slate-200 leading-snug">
                          {scene.contextEnvironmentNotes || scene.environmentNotes || "Đô thị hoàng hôn, chiều sâu trường ảnh điện ảnh tự nhiên."}
                        </p>
                        {scene.contextEnvironmentPrompt && (
                          <p className="text-[9px] text-cyan-300/80 font-mono line-clamp-1 italic">
                            EN: {scene.contextEnvironmentPrompt}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer: Export to Timeline with all voiceover tracks & continuous prompts */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            {scenes.length} cảnh hoàn chỉnh • Lời thoại kịch bản đồng bộ • Prompt tiếng Anh kèm ghi chú tiếng Việt
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePlayFullScript}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
          >
            {isFullScriptPlaying ? <Square className="w-3.5 h-3.5 text-rose-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isFullScriptPlaying ? "Dừng Thử Giọng" : "Nghe Lại Lời Thoại Toàn Bộ Kịch Bản"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportAllToTimeline}
            disabled={isRenderingAll}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>Xuất Trọn Bộ {scenes.length} Cảnh Vào Timeline Video ({totalStoryboardDuration.toFixed(1)}s)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
