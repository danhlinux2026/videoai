import React from "react";
import { Sparkles, Sliders, Film, Music, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { ApiConfig } from "../types";

interface HeaderProps {
  apiConfig: ApiConfig;
  onOpenSettings: () => void;
  onExportClick: () => void;
  isExporting: boolean;
  activeTab: "storyboard" | "character" | "generate" | "audio";
  setActiveTab: (tab: "storyboard" | "character" | "generate" | "audio") => void;
  clipCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  apiConfig,
  onOpenSettings,
  onExportClick,
  isExporting,
  activeTab,
  setActiveTab,
  clipCount,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Agnes AI <span className="text-emerald-400 font-medium">Video Studio</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                V2.0 Core
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Đồng bộ nhịp điệu • Nhân vật tham chiếu HD • Hiệu ứng chuyển cảnh
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("storyboard")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "storyboard"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Kịch Bản 4-5 Cảnh
          </button>
          <button
            onClick={() => setActiveTab("character")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "character"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Nhân Vật & Đa Ảnh
          </button>
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "generate"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Tạo Video Đơn
          </button>
          <button
            onClick={() => setActiveTab("audio")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "audio"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            Nhạc & Nhịp Điệu
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {/* API Status indicator */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 transition-all cursor-pointer"
            title="Cấu hình Agnes AI API & Gemini API"
          >
            {apiConfig.isAgnesConfigured ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Agnes AI Sẵn Sàng
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Giả lập Siêu Nét (Demo)
              </span>
            )}
            <span className="text-slate-500">|</span>
            <Sliders className="w-3 h-3 text-slate-400" />
          </button>

          {/* Export button */}
          <button
            onClick={onExportClick}
            disabled={clipCount === 0 || isExporting}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
              clipCount === 0 || isExporting
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 cursor-pointer shadow-emerald-500/20 active:scale-95"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? "Đang xuất video..." : `Xuất Video (${clipCount})`}
          </button>
        </div>
      </div>
    </header>
  );
};
