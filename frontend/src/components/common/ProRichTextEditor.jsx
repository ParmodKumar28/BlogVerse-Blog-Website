import { useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  RemoveFormatting,
} from 'lucide-react';

const ProRichTextEditor = ({ value, onChange, placeholder = 'Tell your story...' }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html === '<br>' ? '' : html);
    }
  };

  const format = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const addLink = () => {
    const url = prompt('Enter link URL (https://...):');
    if (url) {
      format('createLink', url);
    }
  };

  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 transition">
      {/* Editor Formatting Header Toolbar */}
      <div className="bg-zinc-50 border-b border-zinc-200 p-2 flex flex-wrap items-center gap-1 text-zinc-700 select-none">
        <button
          type="button"
          onClick={() => format('bold')}
          className="p-1.5 hover:bg-zinc-200/80 active:bg-zinc-300 rounded transition text-zinc-800"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('italic')}
          className="p-1.5 hover:bg-zinc-200/80 active:bg-zinc-300 rounded transition text-zinc-800"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('underline')}
          className="p-1.5 hover:bg-zinc-200/80 active:bg-zinc-300 rounded transition text-zinc-800"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        
        <span className="w-px h-4 bg-zinc-300 mx-1" />

        <button
          type="button"
          onClick={() => format('formatBlock', '<h2>')}
          className="p-1.5 hover:bg-zinc-200/80 active:bg-zinc-300 rounded transition text-xs font-bold text-zinc-800"
          title="Subheading H2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('formatBlock', '<h3>')}
          className="p-1.5 hover:bg-zinc-200/80 active:bg-zinc-300 rounded transition text-xs font-bold text-zinc-800"
          title="Section Heading H3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-zinc-300 mx-1" />

        <button
          type="button"
          onClick={() => format('formatBlock', '<blockquote>')}
          className="p-1.5 hover:bg-zinc-200/80 active:bg-zinc-300 rounded transition text-zinc-800"
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('formatBlock', '<pre>')}
          className="p-1.5 hover:bg-zinc-200/80 active:bg-zinc-300 rounded transition text-zinc-800"
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-zinc-300 mx-1" />

        <button
          type="button"
          onClick={() => format('insertUnorderedList')}
          className="p-1.5 hover:bg-zinc-200/80 active:bg-zinc-300 rounded transition text-zinc-800"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => format('insertOrderedList')}
          className="p-1.5 hover:bg-zinc-200/80 active:bg-zinc-300 rounded transition text-zinc-800"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addLink}
          className="p-1.5 hover:bg-zinc-200/80 active:bg-zinc-300 rounded transition text-zinc-800"
          title="Insert Hyperlink"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-zinc-300 mx-1" />

        <button
          type="button"
          onClick={() => format('removeFormat')}
          className="p-1.5 hover:bg-zinc-200/80 active:bg-zinc-300 rounded transition text-zinc-500 hover:text-rose-600"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>
      </div>

      {/* Editable HTML Canvas */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="min-h-[360px] p-5 text-base sm:text-lg font-serif-editorial text-zinc-900 outline-none leading-relaxed prose prose-zinc max-w-none"
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default ProRichTextEditor;
