import { Link as LinkIcon, X, Unlink, ExternalLink } from "lucide-react";

const EditorLinkModal = ({
  linkUrl,
  linkText,
  isEditingExistingLink,
  onUrlChange,
  onTextChange,
  onRemoveLink,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="p-4 bg-zinc-50 border-b border-zinc-200 animate-in fade-in duration-150">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
            {isEditingExistingLink ? "Edit Hyperlink" : "Insert Hyperlink"}
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
              Destination URL *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
              Anchor Display Text
            </label>
            <input
              type="text"
              placeholder="e.g. Read full study"
              value={linkText}
              onChange={(e) => onTextChange(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
          {isEditingExistingLink ? (
            <button
              type="button"
              onClick={onRemoveLink}
              className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded font-semibold flex items-center gap-1 transition"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Remove Link</span>
            </button>
          ) : (
            <span className="text-[11px] text-zinc-400">
              Links will automatically open securely in a new tab.
            </span>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!linkUrl.trim()}
              className="px-4 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isEditingExistingLink ? "Update Link" : "Insert Link"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditorLinkModal;
