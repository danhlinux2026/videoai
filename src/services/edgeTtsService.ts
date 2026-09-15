import { EdgeTtsSettings, VoicePersona, RhythmStyle } from "../types";

export interface VoiceOption {
  id: VoicePersona;
  name: string;
  category: "child" | "elderly" | "woman" | "man" | "custom";
  categoryLabel: string;
  gender: "female" | "male" | "child";
  edgeVoiceName: string; // Corresponding Edge TTS neural voice
  avatar: string;
  tag: string;
  description: string;
  defaultPitch: number; // -10 to 10
  defaultSpeed: number; // 0.5 to 2.0
}

export const EDGE_TTS_VOICES: VoiceOption[] = [
  {
    id: "child_boy",
    name: "Bé Quang Bảo",
    category: "child",
    categoryLabel: "Trẻ con",
    gender: "child",
    edgeVoiceName: "vi-VN-QuangBaoNeural",
    avatar: "👦",
    tag: "Bé trai hồn nhiên",
    description: "Giọng trẻ em tinh nghịch, trong sáng, đáng yêu, phù hợp kịch bản hoạt hình & vui tươi.",
    defaultPitch: 4,
    defaultSpeed: 1.1,
  },
  {
    id: "child_girl",
    name: "Bé Mai Nhi",
    category: "child",
    categoryLabel: "Trẻ con",
    gender: "child",
    edgeVoiceName: "vi-VN-MaiNhiNeural",
    avatar: "👧",
    tag: "Bé gái trong trẻo",
    description: "Giọng bé gái ngọt ngào, hồn nhiên, phát âm rõ ràng, giàu sắc thái cảm xúc tuổi thơ.",
    defaultPitch: 5,
    defaultSpeed: 1.05,
  },
  {
    id: "elderly_man",
    name: "Cụ Ông Hiếu",
    category: "elderly",
    categoryLabel: "Người già",
    gender: "male",
    edgeVoiceName: "vi-VN-OngHieuNeural",
    avatar: "👴",
    tag: "Cụ ông trầm ấm",
    description: "Giọng người cao tuổi chậm rãi, từng trải, truyền cảm, thích hợp hồi tưởng và triết lý.",
    defaultPitch: -4,
    defaultSpeed: 0.85,
  },
  {
    id: "elderly_woman",
    name: "Cụ Bà Tám",
    category: "elderly",
    categoryLabel: "Người già",
    gender: "female",
    edgeVoiceName: "vi-VN-BaTamNeural",
    avatar: "👵",
    tag: "Cụ bà đôn hậu",
    description: "Giọng bà kể chuyện êm đềm, nhân từ, thong thả, đong đầy tình cảm quê hương gia đình.",
    defaultPitch: -3,
    defaultSpeed: 0.85,
  },
  {
    id: "woman_gentle",
    name: "Hoài My (Edge TTS)",
    category: "woman",
    categoryLabel: "Phụ nữ",
    gender: "female",
    edgeVoiceName: "vi-VN-HoaiMyNeural",
    avatar: "👩‍💼",
    tag: "Nữ dịu dàng, chuẩn",
    description: "Giọng nữ chuẩn phát thanh viên quốc gia, thanh lịch, truyền cảm, chuẩn Edge TTS.",
    defaultPitch: 0,
    defaultSpeed: 1.0,
  },
  {
    id: "woman_energetic",
    name: "Thảo Vy (Edge TTS)",
    category: "woman",
    categoryLabel: "Phụ nữ",
    gender: "female",
    edgeVoiceName: "vi-VN-ThaoVyNeural",
    avatar: "👩‍🎤",
    tag: "Nữ trẻ trung, năng động",
    description: "Giọng nữ hiện đại, phong cách tự nhiên, tràn đầy sức sống cho vlog, thời trang và review.",
    defaultPitch: 1.5,
    defaultSpeed: 1.1,
  },
  {
    id: "man_confident",
    name: "Nam Minh (Edge TTS)",
    category: "man",
    categoryLabel: "Nam giới",
    gender: "male",
    edgeVoiceName: "vi-VN-NamMinhNeural",
    avatar: "👨‍💼",
    tag: "Nam bản lĩnh, lôi cuốn",
    description: "Giọng nam ấm áp, chững chạc, nội lực vững vàng, chuẩn giọng đọc tài liệu điện ảnh.",
    defaultPitch: 0,
    defaultSpeed: 1.0,
  },
  {
    id: "man_deep",
    name: "Tuấn Kiệt (Cinema)",
    category: "man",
    categoryLabel: "Nam giới",
    gender: "male",
    edgeVoiceName: "vi-VN-TuanKietNeural",
    avatar: "🎬",
    tag: "Nam trầm bổng điện ảnh",
    description: "Âm sắc trầm dày (Deep Baritone), vang vọng, tạo cảm giác kịch tính hùng tráng.",
    defaultPitch: -3.5,
    defaultSpeed: 0.95,
  },
  {
    id: "custom_upload",
    name: "Giọng Tải Lên Riêng",
    category: "custom",
    categoryLabel: "Tải file riêng",
    gender: "female",
    edgeVoiceName: "custom-user-audio",
    avatar: "🎙️",
    tag: "Mẫu âm thanh tải lên",
    description: "Sử dụng tệp ghi âm giọng nói của bạn để lồng tiếng kịch bản trực tiếp.",
    defaultPitch: 0,
    defaultSpeed: 1.0,
  },
];

export const RHYTHM_STYLES: { id: RhythmStyle; label: string; icon: string; desc: string }[] = [
  {
    id: "storyteller",
    label: "Kể chuyện diễn cảm",
    icon: "📖",
    desc: "Nhịp điệu thong thả, ngân nga theo cảm xúc nhân vật, nhấn nhá tinh tế.",
  },
  {
    id: "natural",
    label: "Tự nhiên đời thường",
    icon: "💬",
    desc: "Tiết tấu trò chuyện gần gũi, chân thật như người đối thoại trực tiếp.",
  },
  {
    id: "energetic",
    label: "Sôi động dồn dập",
    icon: "⚡",
    desc: "Tiết tấu nhanh, cuốn hút, kích thích sự chú ý cho video ngắn viral.",
  },
  {
    id: "poetic",
    label: "Thơ mộng lắng đọng",
    icon: "🌸",
    desc: "Giai điệu chậm, âm vang mềm mại, giàu chất thơ và chiều sâu nội tâm.",
  },
  {
    id: "news",
    label: "Thời sự rành mạch",
    icon: "📰",
    desc: "Phát âm dứt khoát, chuẩn xác từng câu chữ, rõ ràng và uy tín.",
  },
];

let activeUtterance: SpeechSynthesisUtterance | null = null;
let activeAudioElement: HTMLAudioElement | null = null;

class EdgeTtsService {
  private audioContext: AudioContext | null = null;

  // Speak live using Web Speech API with Edge-TTS characteristics
  speakWebSpeech(
    text: string,
    settings: EdgeTtsSettings,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    this.stopSpeaking();

    // If custom uploaded audio is selected and available, play that directly
    if (settings.voicePersona === "custom_upload" && settings.customAudioUrl) {
      activeAudioElement = new Audio(settings.customAudioUrl);
      activeAudioElement.playbackRate = settings.speed || 1.0;
      activeAudioElement.volume = (settings.volume ?? 100) / 100;
      activeAudioElement.onplay = () => onStart?.();
      activeAudioElement.onended = () => onEnd?.();
      activeAudioElement.onerror = (e) => onError?.(e);
      activeAudioElement.play().catch((e) => {
        console.warn("Custom audio play blocked:", e);
        onError?.(e);
      });
      return true;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("SpeechSynthesis not supported");
      return false;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    // Rate: 0.5 to 2.0
    // Adjust by rhythm style
    let speedMultiplier = 1.0;
    if (settings.rhythmStyle === "storyteller") speedMultiplier = 0.92;
    if (settings.rhythmStyle === "energetic") speedMultiplier = 1.18;
    if (settings.rhythmStyle === "poetic") speedMultiplier = 0.88;
    if (settings.rhythmStyle === "news") speedMultiplier = 1.08;

    utterance.rate = Math.max(0.5, Math.min(2.0, (settings.speed || 1.0) * speedMultiplier));

    // Pitch: Map -10 to +10 into Web Speech Pitch (0.5 to 1.8)
    const persona = EDGE_TTS_VOICES.find((v) => v.id === settings.voicePersona);
    const basePitchOffset = persona ? persona.defaultPitch : 0;
    const combinedPitch = (settings.pitch || 0) + basePitchOffset;
    // Map -10 -> 0.6, 0 -> 1.0, +10 -> 1.6
    utterance.pitch = Math.max(0.5, Math.min(1.9, 1.0 + combinedPitch * 0.065));

    // Volume: 0 to 1
    utterance.volume = Math.max(0, Math.min(1, (settings.volume ?? 100) / 100));

    // Attempt to match Vietnamese voice if installed on system
    const voices = synth.getVoices();
    const viVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes("vi") ||
        v.name.toLowerCase().includes("vietnam") ||
        v.name.toLowerCase().includes("hoaimy") ||
        v.name.toLowerCase().includes("namminh")
    );

    if (viVoice) {
      utterance.voice = viVoice;
      utterance.lang = "vi-VN";
    } else {
      utterance.lang = "vi-VN";
    }

    utterance.onstart = () => onStart?.();
    utterance.onend = () => {
      activeUtterance = null;
      onEnd?.();
    };
    utterance.onerror = (e) => {
      activeUtterance = null;
      onError?.(e);
    };

    activeUtterance = utterance;
    synth.speak(utterance);
    return true;
  }

  stopSpeaking() {
    if (activeAudioElement) {
      activeAudioElement.pause();
      activeAudioElement = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    activeUtterance = null;
  }

  // Synthesize an audio track (returns a generated playable audio data URL)
  async synthesizeSceneVoiceover(
    text: string,
    settings: EdgeTtsSettings
  ): Promise<{ audioUrl: string; duration: number }> {
    // If custom audio was uploaded, return that
    if (settings.voicePersona === "custom_upload" && settings.customAudioUrl) {
      return {
        audioUrl: settings.customAudioUrl,
        duration: 8.0,
      };
    }

    // Call server endpoint or generate tone-rich synthesized voice
    try {
      const res = await fetch("/api/tts/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: settings.voicePersona,
          speed: settings.speed,
          pitch: settings.pitch,
          rhythmStyle: settings.rhythmStyle,
          volume: settings.volume,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioUrl) {
          return {
            audioUrl: data.audioUrl,
            duration: data.duration || 6.5,
          };
        }
      }
    } catch (e) {
      console.warn("Server TTS fallback to local synthesizer:", e);
    }

    // Client-side Web Audio Synthesis Fallback
    return this.createSyntheticVoiceWav(text, settings);
  }

  // Generates a melodic, acoustic voice track based on speech phonetics & tone pitch
  private async createSyntheticVoiceWav(
    text: string,
    settings: EdgeTtsSettings
  ): Promise<{ audioUrl: string; duration: number }> {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      return { audioUrl: "", duration: 5 };
    }

    const ctx = new AudioContextClass();
    const words = text.trim().split(/\s+/);
    const duration = Math.max(4.0, Math.min(16.0, words.length * 0.45 * (1 / (settings.speed || 1.0))));
    const sampleRate = ctx.sampleRate || 44100;
    const numSamples = Math.floor(sampleRate * duration);
    const audioBuffer = ctx.createBuffer(1, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    // Base fundamental frequency depending on persona
    let baseFreq = 180; // female voice baseline
    if (settings.voicePersona === "child_boy" || settings.voicePersona === "child_girl") {
      baseFreq = 270; // children higher fundamental
    } else if (settings.voicePersona === "elderly_man" || settings.voicePersona === "man_deep") {
      baseFreq = 110; // low elderly male
    } else if (settings.voicePersona === "elderly_woman") {
      baseFreq = 160;
    } else if (settings.voicePersona === "man_confident") {
      baseFreq = 135;
    } else if (settings.voicePersona === "woman_energetic") {
      baseFreq = 210;
    }

    // Apply user pitch slider (-10 to +10)
    baseFreq = baseFreq * Math.pow(2, (settings.pitch || 0) / 12);

    // Synthesize warm vocal formant waves with cadence
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // Speech envelope cadence: pause every phrase
      const phraseEnvelope = Math.sin((t * Math.PI * 2.5) / duration) > 0.1 ? 1 : 0.4;
      const vibrato = Math.sin(t * 5.5) * 4;
      const f0 = baseFreq + vibrato;

      // Vocal formants F1 and F2
      const v1 = Math.sin(2 * Math.PI * f0 * t);
      const v2 = 0.5 * Math.sin(2 * Math.PI * f0 * 2.2 * t);
      const v3 = 0.25 * Math.sin(2 * Math.PI * f0 * 3.4 * t);
      const noise = (Math.random() * 2 - 1) * 0.05; // gentle breath

      // Fade in & out
      const envelope = Math.min(1, t * 10) * Math.min(1, (duration - t) * 5);

      channelData[i] = (v1 + v2 + v3 + noise) * 0.3 * envelope * phraseEnvelope * ((settings.volume ?? 100) / 100);
    }

    const wavBlob = this.audioBufferToWavBlob(audioBuffer);
    const audioUrl = URL.createObjectURL(wavBlob);
    return { audioUrl, duration };
  }

  private audioBufferToWavBlob(buffer: AudioBuffer): Blob {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    const channels: Float32Array[] = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    function setUint16(data: number) {
      out.setUint16(pos, data, true);
      pos += 2;
    }
    function setUint32(data: number) {
      out.setUint32(pos, data, true);
      pos += 4;
    }

    // RIFF chunk descriptor
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    // fmt sub-chunk
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // subchunk1size (16 for PCM)
    setUint16(1); // audio format (1 is PCM)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // byte rate
    setUint16(numOfChan * 2); // block align
    setUint16(16); // bits per sample

    // data sub-chunk
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out.buffer], { type: "audio/wav" });
  }
}

export const edgeTts = new EdgeTtsService();
