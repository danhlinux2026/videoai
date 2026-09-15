import { VideoClip, TransitionType } from "../types";

export interface RenderProgressCallback {
  (progress: number, statusText: string): void;
}

export class VideoCompositeRenderer {
  /**
   * Renders the clips sequence with transitions and audio into a downloadable blob
   */
  public static async renderAndExport(
    clips: VideoClip[],
    audioUrl?: string,
    onProgress?: RenderProgressCallback
  ): Promise<Blob> {
    if (clips.length === 0) {
      throw new Error("Không có clip nào trong timeline để xuất video.");
    }

    onProgress?.(5, "Đang khởi tạo canvas engine...");

    const width = 1080;
    const height = 1920; // 9:16 vertical short format default
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Could not create canvas 2D context");

    // Pre-load all video elements
    onProgress?.(15, "Đang tải các video clip vào bộ đệm...");
    const videoElements: HTMLVideoElement[] = [];

    for (let i = 0; i < clips.length; i++) {
      const v = document.createElement("video");
      v.crossOrigin = "anonymous";
      v.src = clips[i].videoUrl;
      v.muted = true;
      v.playsInline = true;

      await new Promise<void>((resolve) => {
        v.onloadedmetadata = () => resolve();
        v.onerror = () => {
          console.warn("Clip failed to load, continuing with placeholder", clips[i].videoUrl);
          resolve();
        };
        setTimeout(resolve, 3000); // 3s timeout per clip
      });
      videoElements.push(v);
    }

    // Set up audio if provided
    let audioStreamTrack: MediaStreamTrack | null = null;
    let audioContext: AudioContext | null = null;
    let audioElem: HTMLAudioElement | null = null;

    if (audioUrl) {
      onProgress?.(25, "Đang xử lý nhạc nền và đồng bộ nhịp...");
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContext = new AudioCtx();
        audioElem = new Audio(audioUrl);
        audioElem.crossOrigin = "anonymous";
        await new Promise((res) => {
          audioElem!.oncanplaythrough = res;
          setTimeout(res, 2000);
        });

        const source = audioContext.createMediaElementSource(audioElem);
        const dest = audioContext.createMediaStreamDestination();
        source.connect(dest);
        source.connect(audioContext.destination);
        audioStreamTrack = dest.stream.getAudioTracks()[0] || null;
      } catch (e) {
        console.warn("Could not capture audio stream for recorder:", e);
      }
    }

    // Setup Canvas MediaRecorder
    onProgress?.(35, "Khởi động bộ ghi MediaRecorder...");
    const canvasStream = canvas.captureStream(30); // 30 FPS
    if (audioStreamTrack) {
      canvasStream.addTrack(audioStreamTrack);
    }

    const mimeType = MediaRecorder.isTypeSupported("video/mp4")
      ? "video/mp4"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : "video/webm";

    const recorder = new MediaRecorder(canvasStream, {
      mimeType,
      videoBitsPerSecond: 6000000, // 6 Mbps high quality
    });

    const recordedChunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    recorder.start(100);
    if (audioElem) {
      audioElem.currentTime = 0;
      audioElem.play().catch((e) => console.warn(e));
    }

    // Calculate total duration
    const totalDuration = clips.reduce((sum, c) => sum + c.duration, 0);
    const fps = 30;
    const totalFrames = Math.max(30, Math.floor(totalDuration * fps));
    let currentFrame = 0;

    // Render loop
    return new Promise((resolve, reject) => {
      const renderNext = () => {
        if (currentFrame >= totalFrames) {
          recorder.stop();
          if (audioElem) audioElem.pause();
          onProgress?.(95, "Đang hoàn thiện file video kết xuất...");
          return;
        }

        const currentTime = currentFrame / fps;
        const percent = Math.min(90, Math.floor(35 + (currentFrame / totalFrames) * 55));
        onProgress?.(percent, `Đang render khung hình ${currentFrame}/${totalFrames}...`);

        // Find which clip is active
        let accumulatedTime = 0;
        let activeIndex = 0;
        let clipLocalTime = 0;

        for (let i = 0; i < clips.length; i++) {
          if (currentTime >= accumulatedTime && currentTime < accumulatedTime + clips[i].duration) {
            activeIndex = i;
            clipLocalTime = currentTime - accumulatedTime;
            break;
          }
          accumulatedTime += clips[i].duration;
        }

        const activeClip = clips[activeIndex];
        const nextClip = clips[activeIndex + 1];
        const transition = activeClip?.transitionToNext;
        const transitionDuration = transition?.duration || 0.6;
        const timeUntilEnd = activeClip.duration - clipLocalTime;

        // Check if we are in transition zone
        const isTransitioning = transition && transition.type !== "none" && timeUntilEnd <= transitionDuration && nextClip;

        // Draw active video
        const v1 = videoElements[activeIndex];
        if (v1 && v1.readyState >= 2) {
          // Keep video in sync with clipLocalTime
          v1.currentTime = clipLocalTime % (v1.duration || activeClip.duration);
          ctx.drawImage(v1, 0, 0, width, height);
        } else {
          // Render stylistic placeholder frame
          drawStylizedBackground(ctx, width, height, activeClip.title, activeIndex);
        }

        // Apply transition effect
        if (isTransitioning) {
          const progress = 1 - timeUntilEnd / transitionDuration;
          const v2 = videoElements[activeIndex + 1];
          applyTransitionEffect(ctx, width, height, transition.type, progress, v2, nextClip.title, activeIndex + 1);
        }

        currentFrame++;
        requestAnimationFrame(renderNext);
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(recordedChunks, { type: mimeType });
        onProgress?.(100, "Hoàn tất tạo video thành công!");
        resolve(finalBlob);
      };

      recorder.onerror = (err) => {
        reject(err);
      };

      renderNext();
    });
  }
}

// Helpers for canvas drawing
function drawStylizedBackground(ctx: CanvasRenderingContext2D, w: number, h: number, title: string, index: number) {
  const gradients = [
    ["#0f172a", "#1e1b4b", "#312e81"],
    ["#18181b", "#27272a", "#3f3f46"],
    ["#022c22", "#064e3b", "#047857"],
    ["#3b0764", "#581c87", "#7e22ce"],
  ];
  const g = gradients[index % gradients.length];
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, g[0]);
  grad.addColorStop(0.5, g[1]);
  grad.addColorStop(1, g[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Title badge
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "bold 44px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, w / 2, h / 2 - 20);

  ctx.fillStyle = "rgba(200, 220, 255, 0.6)";
  ctx.font = "28px sans-serif";
  ctx.fillText("Agnes AI Model Rendered Frame", w / 2, h / 2 + 30);
}

function applyTransitionEffect(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  type: TransitionType,
  progress: number,
  nextVideo?: HTMLVideoElement,
  nextTitle = "",
  nextIndex = 0
) {
  ctx.save();

  if (type === "crossfade" || type === "blur_dissolve") {
    ctx.globalAlpha = Math.max(0, Math.min(1, progress));
    if (nextVideo && nextVideo.readyState >= 2) {
      ctx.drawImage(nextVideo, 0, 0, w, h);
    } else {
      drawStylizedBackground(ctx, w, h, nextTitle, nextIndex);
    }
  } else if (type === "flash_white") {
    const flashAlpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
    if (progress >= 0.5) {
      if (nextVideo && nextVideo.readyState >= 2) {
        ctx.drawImage(nextVideo, 0, 0, w, h);
      } else {
        drawStylizedBackground(ctx, w, h, nextTitle, nextIndex);
      }
    }
    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.9})`;
    ctx.fillRect(0, 0, w, h);
  } else if (type === "zoom_in") {
    const scale = 1 + progress * 0.35;
    ctx.translate(w / 2, h / 2);
    ctx.scale(scale, scale);
    ctx.translate(-w / 2, -h / 2);
    if (progress > 0.4) {
      ctx.globalAlpha = (progress - 0.4) / 0.6;
      if (nextVideo && nextVideo.readyState >= 2) {
        ctx.drawImage(nextVideo, 0, 0, w, h);
      } else {
        drawStylizedBackground(ctx, w, h, nextTitle, nextIndex);
      }
    }
  } else if (type === "whip_pan") {
    const offset = progress * w;
    if (nextVideo && nextVideo.readyState >= 2) {
      ctx.drawImage(nextVideo, w - offset, 0, w, h);
    } else {
      ctx.save();
      ctx.translate(w - offset, 0);
      drawStylizedBackground(ctx, w, h, nextTitle, nextIndex);
      ctx.restore();
    }
  } else if (type === "glitch") {
    // Strobe scanlines
    if (progress > 0.3) {
      ctx.globalAlpha = progress;
      if (nextVideo && nextVideo.readyState >= 2) {
        ctx.drawImage(nextVideo, (Math.random() - 0.5) * 20, 0, w, h);
      } else {
        drawStylizedBackground(ctx, w, h, nextTitle, nextIndex);
      }
    }
    ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
    ctx.fillRect(0, Math.random() * h, w, 20);
    ctx.fillStyle = "rgba(255, 0, 128, 0.3)";
    ctx.fillRect(0, Math.random() * h, w, 20);
  }

  ctx.restore();
}
