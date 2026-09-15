import { BeatMarker } from "../types";

export class AudioBeatEngine {
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private isInitialized = false;

  constructor() {
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = "anonymous";
    this.audioElement.preload = "auto";
  }

  public getAudioElement(): HTMLAudioElement | null {
    return this.audioElement;
  }

  public async loadTrack(url: string): Promise<number> {
    if (!this.audioElement) return 0;
    this.audioElement.src = url;

    return new Promise((resolve) => {
      if (!this.audioElement) return resolve(0);
      this.audioElement.onloadedmetadata = () => {
        resolve(this.audioElement?.duration || 0);
      };
      this.audioElement.onerror = () => {
        resolve(30); // fallback duration
      };
    });
  }

  public initWebAudio() {
    if (this.isInitialized || !this.audioElement) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API not fully available:", e);
    }
  }

  public play(fromTime?: number) {
    if (!this.audioElement) return;
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    if (typeof fromTime === "number") {
      this.audioElement.currentTime = fromTime;
    }
    this.audioElement.play().catch((e) => console.warn("Audio play prevented:", e));
  }

  public pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public seek(time: number) {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
    }
  }

  public setVolume(vol: number) {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, vol));
    }
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(16);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  /**
   * Fast client-side rhythm / beat detection from audio URL buffer
   */
  public async analyzeBeatsFromBuffer(audioUrl: string, expectedBpm = 120): Promise<{ bpm: number; beats: BeatMarker[] }> {
    try {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const offlineCtx = new AudioCtx();
      const audioBuffer = await offlineCtx.decodeAudioData(arrayBuffer);

      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      const duration = audioBuffer.duration;

      // Energy peak detection with window
      const step = Math.floor(sampleRate * 0.05); // 50ms windows
      const energies: number[] = [];
      for (let i = 0; i < channelData.length; i += step) {
        let sum = 0;
        const end = Math.min(i + step, channelData.length);
        for (let j = i; j < end; j++) {
          sum += channelData[j] * channelData[j];
        }
        energies.push(Math.sqrt(sum / (end - i)));
      }

      // Compute local threshold
      const averageEnergy = energies.reduce((a, b) => a + b, 0) / energies.length;
      const beats: BeatMarker[] = [];
      const minInterval = (60 / 180); // max 180 BPM
      let lastBeatTime = -minInterval;

      for (let i = 1; i < energies.length - 1; i++) {
        const time = (i * step) / sampleRate;
        if (
          energies[i] > energies[i - 1] &&
          energies[i] > energies[i + 1] &&
          energies[i] > averageEnergy * 1.35 &&
          time - lastBeatTime >= minInterval
        ) {
          const intensity = Math.min(1, energies[i] / (averageEnergy * 2.5));
          beats.push({
            timestamp: Number(time.toFixed(2)),
            intensity,
            isDrop: intensity > 0.85,
          });
          lastBeatTime = time;
        }
      }

      // Estimate BPM
      let detectedBpm = expectedBpm;
      if (beats.length > 5) {
        const intervals: number[] = [];
        for (let i = 1; i < Math.min(beats.length, 30); i++) {
          intervals.push(beats[i].timestamp - beats[i - 1].timestamp);
        }
        intervals.sort((a, b) => a - b);
        const medianInterval = intervals[Math.floor(intervals.length / 2)];
        if (medianInterval > 0.25 && medianInterval < 1.2) {
          detectedBpm = Math.round(60 / medianInterval);
          // Normalize to typical 70-160 range
          if (detectedBpm < 70) detectedBpm *= 2;
          if (detectedBpm > 170) detectedBpm = Math.round(detectedBpm / 2);
        }
      }

      return { bpm: detectedBpm, beats };
    } catch (err) {
      console.warn("Audio buffer beat detection fallback:", err);
      // Mathematical fallback based on expectedBpm
      const beatInterval = 60 / expectedBpm;
      const beats: BeatMarker[] = [];
      for (let t = beatInterval; t < 30; t += beatInterval) {
        beats.push({
          timestamp: Number(t.toFixed(2)),
          intensity: Math.random() * 0.4 + 0.6,
          isDrop: Math.round(t / beatInterval) % 4 === 0,
        });
      }
      return { bpm: expectedBpm, beats };
    }
  }
}

export const beatEngine = new AudioBeatEngine();
