import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Quote,
  Terminal,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  RemoveFormatting,
  Undo,
  Redo,
} from "lucide-react";

const EditorToolbar = ({
  activeFormats,
  showLinkModal,
  showImageModal,
  onExecuteCommand,
  onToggleBlock,
  onToggleList,
  onToggleInlineCode,
  onClearFormatting,
  onOpenLinkModal,
  onOpenImageModal,
}) => {
  const getBtnClass = (isActive) =>
    `p-1.5 rounded transition text-xs flex items-center justify-center font-medium ${
      isActive
        ? "bg-zinc-900 text-white shadow-xs"
        : "text-zinc-700 hover:bg-zinc-200/80 hover:text-zinc-900 active:bg-zinc-300"
    }`;

  return (
    <div className="bg-zinc-50 border-b border-zinc-200 p-2 flex flex-wrap items-center gap-1 select-none">
      {/* Undo / Redo */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onExecuteCommand("undo")}
        className={getBtnClass(false)}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onExecuteCommand("redo")}
        className={getBtnClass(false)}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </button>

      <span className="w-px h-4 bg-zinc-300 mx-1" />

      {/* Text styling */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onExecuteCommand("bold")}
        className={getBtnClass(activeFormats.bold)}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onExecuteCommand("italic")}
        className={getBtnClass(activeFormats.italic)}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onExecuteCommand("underline")}
        className={getBtnClass(activeFormats.underline)}
        title="Underline (Ctrl+U)"
      >
        <Underline className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onExecuteCommand("strikeThrough")}
        className={getBtnClass(activeFormats.strikeThrough)}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onToggleInlineCode}
        className={getBtnClass(activeFormats.inlineCode)}
        title="Inline Code"
      >
        <Code className="w-4 h-4" />
      </button>

      <span className="w-px h-4 bg-zinc-300 mx-1" />

      {/* Headings & Blocks */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToggleBlock("h2")}
        className={getBtnClass(activeFormats.h2)}
        title="Subheading H2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToggleBlock("h3")}
        className={getBtnClass(activeFormats.h3)}
        title="Section Heading H3"
      >
        <Heading3 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToggleBlock("blockquote")}
        className={getBtnClass(activeFormats.blockquote)}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToggleBlock("pre")}
        className={getBtnClass(activeFormats.codeBlock)}
        title="Code Block"
      >
        <Terminal className="w-4 h-4" />
      </button>

      <span className="w-px h-4 bg-zinc-300 mx-1" />

      {/* Lists & Divider */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToggleList("insertUnorderedList")}
        className={getBtnClass(activeFormats.ul)}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToggleList("insertOrderedList")}
        className={getBtnClass(activeFormats.ol)}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onExecuteCommand("insertHorizontalRule")}
        className={getBtnClass(false)}
        title="Horizontal Divider"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-px h-4 bg-zinc-300 mx-1" />

      {/* Hyperlink */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onOpenLinkModal}
        className={getBtnClass(activeFormats.link || showLinkModal)}
        title="Insert or Edit Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>

      {/* Embed Image by Link */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onOpenImageModal}
        className={getBtnClass(showImageModal)}
        title="Embed Image from URL"
      >
        <ImageIcon className="w-4 h-4 text-blue-600 font-bold" />
      </button>

      <span className="w-px h-4 bg-zinc-300 mx-1" />

      {/* Clear formatting */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClearFormatting}
        className="p-1.5 hover:bg-rose-50 text-zinc-500 hover:text-rose-600 rounded transition"
        title="Clear Formatting"
      >
        <RemoveFormatting className="w-4 h-4" />
      </button>
    </div>
  );
};

export default EditorToolbar;
