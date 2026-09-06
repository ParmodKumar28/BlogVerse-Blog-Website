import { Image as ImageIcon, X, Check, Sparkles } from "lucide-react";
import { EDITOR_PRESET_IMAGES } from "../../../utils/blog.constants";

const EditorImageModal = ({
  imageUrl,
  imageAlt,
  imageError,
  onUrlChange,
  onAltChange,
  onSetPreset,
  onError,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="p-4 bg-zinc-50 border-b border-zinc-200 animate-in fade-in duration-150">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
            Embed Image by Link
          </h4>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-zinc-700 rounded transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
              Image Direct URL (https://...) *
            </label>
            <input
              type="url"
              required
              autoFocus
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
              Caption / Alt Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Architecture of modern distributed system"
              value={imageAlt}
              onChange={(e) => onAltChange(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
            />
          </div>
        </div>

        {/* Quick Preset Images from utils */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-zinc-500 font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Curated Presets:
          </span>
          {EDITOR_PRESET_IMAGES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onSetPreset(preset.url, preset.alt)}
              className="text-[11px] px-2.5 py-1 bg-white border border-zinc-200 hover:border-zinc-400 rounded-md text-zinc-700 font-medium transition"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Live Preview of image */}
        {imageUrl && !imageError && (
          <div className="pt-2">
            <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">
              Image Live Preview
            </p>
            <div className="relative max-h-36 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={imageAlt || "Preview"}
                onError={onError}
                className="max-h-36 w-full object-cover"
              />
            </div>
          </div>
        )}

        {imageError && (
          <p className="text-xs text-rose-600">
            Could not load image preview from this URL. Please verify the link.
          </p>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!imageUrl.trim()}
            className="px-4 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Embed Image into Story</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditorImageModal;
