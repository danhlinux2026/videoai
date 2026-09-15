import {
  GenerationMode,
  AspectRatio,
  CameraMotion,
  CharacterProfile,
  GenerationTaskState,
  VisualStyleCategory,
  StoryboardScene,
} from "../types";

export interface GenerateVideoParams {
  prompt: string;
  negative_prompt?: string;
  model: string;
  mode: GenerationMode;
  image_url?: string;
  reference_image?: string;
  video_url?: string;
  aspect_ratio: AspectRatio;
  duration: number;
  resolution?: string;
  fps?: number;
  camera_motion?: CameraMotion;
  character_options?: Partial<CharacterProfile>;
  visualStyle?: VisualStyleCategory;
  apiKey?: string;
  baseUrl?: string;
}

export const AgnesApiService = {
  async checkHealth() {
    try {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error("Health check failed");
      return await res.json();
    } catch (e: any) {
      console.warn("Could not check health:", e.message);
      return { hasAgnesKey: false, hasGeminiKey: false };
    }
  },

  async testConnection(apiKey: string, baseUrl?: string) {
    const res = await fetch("/api/agnes/test-connection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, baseUrl }),
    });
    return await res.json();
  },

  async generateVideo(params: GenerateVideoParams): Promise<{ task_id: string; status: string; isRealApi: boolean }> {
    const res = await fetch("/api/agnes/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || "Không thể tạo video từ Agnes AI");
    }

    return await res.json();
  },

  async generateCharacterImage(params: {
    referenceImage: string;
    outfit?: string;
    expression?: string;
    expressionIntensity?: number;
    lighting?: string;
    framing?: string;
    model?: string;
    visualStyle?: VisualStyleCategory;
    apiKey?: string;
    baseUrl?: string;
  }): Promise<{
    success: boolean;
    imageUrl: string;
    isRealApi: boolean;
    model: string;
    prompt: string;
    message: string;
  }> {
    const res = await fetch("/api/agnes/character-image-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || "Không thể tạo ảnh nhân vật qua Agnes AI");
    }

    return await res.json();
  },

  async analyzeCharacterWithGemini(imageBase64: string): Promise<{
    success: boolean;
    biometricDescription: string;
    facialLandmarkLock?: string;
    recommendedAgnesPrompt?: string;
  }> {
    const res = await fetch("/api/gemini/analyze-character", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || "Không thể phân tích ảnh nhân vật");
    }

    return await res.json();
  },

  async pollTask(taskId: string, apiKey?: string, baseUrl?: string): Promise<GenerationTaskState> {
    const query = new URLSearchParams();
    if (apiKey) query.set("apiKey", apiKey);
    if (baseUrl) query.set("baseUrl", baseUrl);

    const res = await fetch(`/api/agnes/task/${taskId}?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`Lỗi kiểm tra tiến trình: ${res.statusText}`);
    }
    return await res.json();
  },

  async enhancePrompt(
    prompt: string,
    characterDetails?: Partial<CharacterProfile>,
    visualStyle: VisualStyleCategory = "cinematic"
  ): Promise<string> {
    const res = await fetch("/api/gemini/enhance-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, characterDetails, visualStyle }),
    });

    if (!res.ok) {
      throw new Error("Không thể tối ưu hóa prompt");
    }

    const data = await res.json();
    return data.enhancedPrompt;
  },

  async generateStoryboard(params: {
    theme: string;
    visualStyle: VisualStyleCategory;
    sceneCount: 4 | 5;
    characterDetails?: Partial<CharacterProfile>;
  }): Promise<{ title: string; synopsis?: string; scenes: StoryboardScene[] }> {
    const res = await fetch("/api/gemini/generate-storyboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error("Không thể tạo kịch bản 4-5 cảnh");
    }

    const data = await res.json();
    return data.storyboard;
  },

  async suggestBeats(bpm: number, totalDuration: number, mood = "energetic") {
    const res = await fetch("/api/gemini/suggest-beats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bpm, totalDuration, mood }),
    });

    if (!res.ok) throw new Error("Could not calculate beat cues");
    return await res.json();
  },

  async getDemoAssets() {
    const res = await fetch("/api/demo-assets");
    if (!res.ok) throw new Error("Could not fetch demo assets");
    return await res.json();
  },
};
