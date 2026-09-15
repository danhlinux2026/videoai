import React from "react";
import {
  X,
  Download,
  CheckCircle2,
  RefreshCw,
  Film,
  Sparkles,
  Share2,
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  statusText: string;
  isCompleted: boolean;
  exportedBlob: Blob | null;
  exportedUrl: string | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  progress,
  statusText,
  isCompleted,
  exportedBlob,
  exportedUrl,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (!exportedUrl) return;
    const a = document.createElement("a");
    a.href = exportedUrl;
    a.download = `AgnesAI_ShortVideo_${Date.now()}.${exportedBlob?.type.includes("mp4") ? "mp4" : "webm"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Film className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Xuất Video Ngắn Hoàn Chỉnh</h3>
              <p className="text-xs text-slate-400">Kết xuất canvas 1080p • Chuyển cảnh & Nhạc nền</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {!isCompleted ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">Đang xử lý xuất video...</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">{statusText}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Tiến độ</span>
                  <span className="text-emerald-400 font-bold">{progress}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center py-2 animate-in fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Video Đã Sẵn Sàng!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Đã lồng nhạc nền, tự động đồng bộ nhịp điệu và áp dụng hiệu ứng chuyển cảnh thành công.
                </p>
              </div>

              {/* Video preview mini player */}
              {exportedUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 max-h-48 bg-black flex items-center justify-center">
                  <video
                    src={exportedUrl}
                    controls
                    autoPlay
                    loop
                    className="max-h-48 w-auto rounded-xl"
                  />
                </div>
              )}

              {/* Stats */}
              {exportedBlob && (
                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span>Dung lượng: {(exportedBlob.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>•</span>
                  <span>Định dạng: {exportedBlob.type.includes("mp4") ? "MP4 (H.264)" : "WebM"}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Đóng
          </button>

          {isCompleted && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải Video Xuống Máy</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
