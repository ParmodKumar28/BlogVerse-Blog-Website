/**
 * Helper utilities for ProRichTextEditor:
 * DOM traversal, selection range management, and cross-browser execCommands.
 */

// Cross-browser formatBlock helper (Chrome/Safari angle brackets vs Firefox bare tag)
export const applyFormatBlock = (tag) => {
  const cleanTag = tag.toLowerCase().replace(/[<>]/g, "");
  let success = false;
  try {
    success = document.execCommand("formatBlock", false, `<${cleanTag}>`);
  } catch {
    success = false;
  }
  if (!success) {
    try {
      success = document.execCommand("formatBlock", false, cleanTag);
    } catch {
      success = false;
    }
  }
  if (!success) {
    try {
      success = document.execCommand(
        "formatBlock",
        false,
        `<${cleanTag.toUpperCase()}>`
      );
    } catch {
      success = false;
    }
  }
  return success;
};

// Returns current active block tag (h1, h2, h3, h4, blockquote, pre, p)
export const getBlockTag = (editorEl) => {
  try {
    const val = document.queryCommandValue("formatBlock");
    if (val) {
      const clean = val.toLowerCase().replace(/[<>]/g, "");
      if (["h1", "h2", "h3", "h4", "blockquote", "pre", "p"].includes(clean)) {
        return clean;
      }
    }
  } catch {
    // Ignore queryCommandValue errors
  }

  const selection = window.getSelection();
  if (!selection || !selection.anchorNode) return null;
  let node =
    selection.anchorNode.nodeType === Node.ELEMENT_NODE
      ? selection.anchorNode
      : selection.anchorNode.parentElement;
  while (node && node !== editorEl) {
    const tagName = node.tagName ? node.tagName.toLowerCase() : "";
    if (["h1", "h2", "h3", "h4", "blockquote", "pre", "p"].includes(tagName)) {
      return tagName;
    }
    node = node.parentElement;
  }
  return null;
};

// Check if cursor/selection is inside specific tag names
export const isInsideTag = (editorEl, tagNames) => {
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode) return false;
  let node =
    selection.anchorNode.nodeType === Node.ELEMENT_NODE
      ? selection.anchorNode
      : selection.anchorNode.parentElement;
  while (node && node !== editorEl) {
    const tagName = node.tagName ? node.tagName.toLowerCase() : "";
    if (tagNames.includes(tagName)) return true;
    node = node.parentElement;
  }
  return false;
};

// Check if cursor/selection is inside an <a> tag
export const getParentLinkNode = (editorEl) => {
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode) return null;
  let node =
    selection.anchorNode.nodeType === Node.ELEMENT_NODE
      ? selection.anchorNode
      : selection.anchorNode.parentElement;
  while (node && node !== editorEl) {
    if (node.tagName && node.tagName.toLowerCase() === "a") {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

// Check if cursor is inside <code>
export const getParentCodeNode = (editorEl) => {
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode) return null;
  let node =
    selection.anchorNode.nodeType === Node.ELEMENT_NODE
      ? selection.anchorNode
      : selection.anchorNode.parentElement;
  while (node && node !== editorEl) {
    if (node.tagName && node.tagName.toLowerCase() === "code") {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

// Check if editor HTML content is empty
export const checkIsEmpty = (html) => {
  if (!html) return true;
  const stripped = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  const hasMedia = /<img\b[^>]*>|<hr\b[^>]*>/i.test(html);
  return stripped.length === 0 && !hasMedia;
};

// Ensure a valid selection exists inside the editor canvas
export const ensureEditorSelection = (editorEl, savedRangeRef) => {
  if (!editorEl) return;
  editorEl.focus();

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (editorEl.contains(range.commonAncestorContainer)) {
      return;
    }
  }

  // Restore saved range if available and valid
  if (
    savedRangeRef?.current &&
    editorEl.contains(savedRangeRef.current.commonAncestorContainer)
  ) {
    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
    return;
  }

  // Otherwise, place cursor at the end
  const range = document.createRange();
  range.selectNodeContents(editorEl);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  if (savedRangeRef) {
    savedRangeRef.current = range;
  }
};

// Save current selection range
export const saveSelection = (editorEl, savedRangeRef) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (editorEl && editorEl.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
      return;
    }
  }
  if (editorEl) {
    const range = document.createRange();
    range.selectNodeContents(editorEl);
    range.collapse(false);
    savedRangeRef.current = range;
  }
};

// Restore saved selection range
export const restoreSelection = (editorEl, savedRangeRef) => {
  if (!editorEl) return;
  editorEl.focus();
  const selection = window.getSelection();
  if (selection && savedRangeRef?.current) {
    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  }
};
