import { useRef, useEffect, useState, useCallback } from "react";
import EditorToolbar from "./richTextEditor/EditorToolbar";
import EditorImageModal from "./richTextEditor/EditorImageModal";
import EditorLinkModal from "./richTextEditor/EditorLinkModal";
import EditorStatusBar from "./richTextEditor/EditorStatusBar";
import {
  applyFormatBlock,
  getBlockTag,
  isInsideTag,
  getParentLinkNode,
  getParentCodeNode,
  checkIsEmpty,
  ensureEditorSelection,
  saveSelection,
  restoreSelection,
} from "./richTextEditor/editorHelpers";

const ProRichTextEditor = ({
  value,
  onChange,
  placeholder = "Tell your story in detail...",
}) => {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);

  // Active formats state for highlighting toolbar buttons
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    h2: false,
    h3: false,
    blockquote: false,
    codeBlock: false,
    inlineCode: false,
    ul: false,
    ol: false,
    link: false,
  });

  // Modal dialog states
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageError, setImageError] = useState(false);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isEditingExistingLink, setIsEditingExistingLink] = useState(false);

  // Sync external value to innerHTML without disrupting active typing
  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== (value || "") &&
      document.activeElement !== editorRef.current
    ) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  // Update active format state
  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current) return;
    try {
      const block = getBlockTag(editorRef.current);
      const linkNode = getParentLinkNode(editorRef.current);
      const codeNode = getParentCodeNode(editorRef.current);
      const isUl =
        document.queryCommandState("insertUnorderedList") ||
        isInsideTag(editorRef.current, ["ul"]);
      const isOl =
        document.queryCommandState("insertOrderedList") ||
        isInsideTag(editorRef.current, ["ol"]);

      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough"),
        h2: block === "h2",
        h3: block === "h3",
        blockquote: block === "blockquote",
        codeBlock: block === "pre",
        inlineCode: !!codeNode && block !== "pre",
        ul: isUl,
        ol: isOl,
        link: !!linkNode,
      });
    } catch {
      // Ignore query errors
    }
  }, []);

  // Safe input handler
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const cleanHtml = html === "<br>" || html === "<p><br></p>" ? "" : html;
    onChange(cleanHtml);
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  // Formatting helpers
  const executeCommand = (command, val = null) => {
    ensureEditorSelection(editorRef.current, savedRangeRef);
    document.execCommand(command, false, val);
    handleInput();
  };

  const toggleBlock = (tag) => {
    ensureEditorSelection(editorRef.current, savedRangeRef);
    const currentTag = getBlockTag(editorRef.current);
    if (currentTag === tag.toLowerCase()) {
      applyFormatBlock("p");
    } else {
      applyFormatBlock(tag);
    }
    handleInput();
  };

  const toggleList = (command) => {
    ensureEditorSelection(editorRef.current, savedRangeRef);
    document.execCommand(command, false, null);
    handleInput();
  };

  const toggleInlineCode = () => {
    ensureEditorSelection(editorRef.current, savedRangeRef);
    const codeNode = getParentCodeNode(editorRef.current);
    if (codeNode) {
      const parent = codeNode.parentNode;
      while (codeNode.firstChild) {
        parent.insertBefore(codeNode.firstChild, codeNode);
      }
      parent.removeChild(codeNode);
      handleInput();
    } else {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        document.execCommand("insertHTML", false, "<code>code</code>");
      } else {
        const text = selection.toString();
        document.execCommand("insertHTML", false, `<code>${text}</code>`);
      }
      handleInput();
    }
  };

  const clearFormatting = () => {
    ensureEditorSelection(editorRef.current, savedRangeRef);
    document.execCommand("removeFormat", false, null);
    applyFormatBlock("p");
    handleInput();
  };

  // Image modal handlers
  const handleOpenImageModal = () => {
    saveSelection(editorRef.current, savedRangeRef);
    setImageUrl("");
    setImageAlt("");
    setImageError(false);
    setShowImageModal(true);
    setShowLinkModal(false);
  };

  const handleSetPresetImage = (url, alt) => {
    setImageUrl(url);
    setImageAlt(alt);
    setImageError(false);
  };

  const handleInsertImage = (e) => {
    if (e) e.preventDefault();
    if (!imageUrl.trim()) return;

    restoreSelection(editorRef.current, savedRangeRef);
    const cleanUrl = imageUrl.trim();
    const altText = imageAlt.trim();

    const imageHtml = `
      <p><br></p>
      <figure class="my-6 block not-prose">
        <img 
          src="${cleanUrl}" 
          alt="${altText || "Blog visual"}" 
          class="w-full max-h-[480px] object-cover rounded-xl border border-zinc-200 shadow-xs" 
          loading="lazy"
        />
        ${altText ? `<figcaption class="text-xs text-center text-zinc-500 mt-2 font-sans italic">${altText}</figcaption>` : ""}
      </figure>
      <p><br></p>
    `;

    document.execCommand("insertHTML", false, imageHtml);
    setShowImageModal(false);
    setImageUrl("");
    setImageAlt("");
    handleInput();
  };

  // Link modal handlers
  const handleOpenLinkModal = () => {
    saveSelection(editorRef.current, savedRangeRef);
    const linkNode = getParentLinkNode(editorRef.current);
    const selection = window.getSelection();

    if (linkNode) {
      setIsEditingExistingLink(true);
      setLinkUrl(linkNode.getAttribute("href") || "");
      setLinkText(linkNode.innerText || "");
    } else {
      setIsEditingExistingLink(false);
      setLinkUrl("");
      setLinkText(selection ? selection.toString() : "");
    }

    setShowLinkModal(true);
    setShowImageModal(false);
  };

  const handleApplyLink = (e) => {
    if (e) e.preventDefault();
    if (!linkUrl.trim()) return;

    let finalUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith("mailto:")) {
      finalUrl = "https://" + finalUrl;
    }

    restoreSelection(editorRef.current, savedRangeRef);

    if (isEditingExistingLink) {
      const linkNode = getParentLinkNode(editorRef.current);
      if (linkNode) {
        linkNode.setAttribute("href", finalUrl);
        if (linkText.trim()) {
          linkNode.innerText = linkText.trim();
        }
      }
    } else {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        const displayText = linkText.trim() || finalUrl;
        const linkHtml = `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline font-medium hover:text-blue-800">${displayText}</a>`;
        document.execCommand("insertHTML", false, linkHtml);
      } else {
        document.execCommand("createLink", false, finalUrl);
        const linkNode = getParentLinkNode(editorRef.current);
        if (linkNode) {
          linkNode.setAttribute("target", "_blank");
          linkNode.setAttribute("rel", "noopener noreferrer");
        }
      }
    }

    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    handleInput();
  };

  const handleRemoveLink = () => {
    restoreSelection(editorRef.current, savedRangeRef);
    document.execCommand("unlink", false, null);
    setShowLinkModal(false);
    handleInput();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
      handleInput();
    }
  };

  // Content calculations for status bar
  const rawText = (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
  const wordCount = rawText ? rawText.split(/\s+/).filter(Boolean).length : 0;
  const charCount = rawText.length;
  const estimatedMin = Math.max(1, Math.ceil(wordCount / 200));
  const isEmpty = checkIsEmpty(value);

  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 transition relative">
      {/* Modular Toolbar */}
      <EditorToolbar
        activeFormats={activeFormats}
        showLinkModal={showLinkModal}
        showImageModal={showImageModal}
        onExecuteCommand={executeCommand}
        onToggleBlock={toggleBlock}
        onToggleList={toggleList}
        onToggleInlineCode={toggleInlineCode}
        onClearFormatting={clearFormatting}
        onOpenLinkModal={handleOpenLinkModal}
        onOpenImageModal={handleOpenImageModal}
      />

      {/* Embed Image Dialog */}
      {showImageModal && (
        <EditorImageModal
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          imageError={imageError}
          onUrlChange={(url) => {
            setImageUrl(url);
            setImageError(false);
          }}
          onAltChange={setImageAlt}
          onSetPreset={handleSetPresetImage}
          onError={() => setImageError(true)}
          onSubmit={handleInsertImage}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {/* Hyperlink Dialog */}
      {showLinkModal && (
        <EditorLinkModal
          linkUrl={linkUrl}
          linkText={linkText}
          isEditingExistingLink={isEditingExistingLink}
          onUrlChange={setLinkUrl}
          onTextChange={setLinkText}
          onRemoveLink={handleRemoveLink}
          onSubmit={handleApplyLink}
          onClose={() => setShowLinkModal(false)}
        />
      )}

      {/* Editable HTML Canvas */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        onFocus={updateActiveFormats}
        className="editor-canvas min-h-[380px] p-6 text-base sm:text-lg font-serif-editorial text-zinc-900 outline-none leading-relaxed prose prose-zinc max-w-none"
        data-placeholder={placeholder}
        data-empty={isEmpty}
        spellCheck="true"
      />

      {/* Modular Status Bar Footer */}
      <EditorStatusBar
        wordCount={wordCount}
        charCount={charCount}
        estimatedMin={estimatedMin}
      />
    </div>
  );
};

export default ProRichTextEditor;
