const EditorStatusBar = ({ wordCount, charCount, estimatedMin }) => {
  return (
    <div className="bg-zinc-50 border-t border-zinc-200 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-zinc-500 select-none">
      <div className="flex items-center gap-4">
        <span>
          <strong className="text-zinc-800 font-semibold">{wordCount}</strong>{" "}
          {wordCount === 1 ? "word" : "words"}
        </span>
        <span>
          <strong className="text-zinc-800 font-semibold">{charCount}</strong>{" "}
          characters
        </span>
        <span className="hidden sm:inline text-zinc-300">|</span>
        <span className="hidden sm:inline text-zinc-400">
          Est. ~{estimatedMin} min read
        </span>
      </div>
    </div>
  );
};

export default EditorStatusBar;
