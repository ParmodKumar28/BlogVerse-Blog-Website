const FormattedContent = ({ content, className = '' }) => {
  if (!content) return null;

  // Check if content is HTML (e.g. from ReactQuill WYSIWYG editor)
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className={`prose prose-zinc max-w-none font-serif-editorial text-zinc-800 leading-relaxed space-y-4 ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Fallback markdown parsing for legacy/plain text content
  const lines = content.split('\n');

  const renderFormattedText = (text) => {
    const parts = [];
    let currentIndex = 0;
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index));
      }

      const matchStr = match[0];
      if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-zinc-900">
            {matchStr.slice(2, -2)}
          </strong>
        );
      } else if (matchStr.startsWith('*') && matchStr.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-zinc-800">
            {matchStr.slice(1, -1)}
          </em>
        );
      } else if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
        parts.push(
          <code key={match.index} className="bg-zinc-100 text-zinc-900 font-mono text-xs px-1.5 py-0.5 rounded border border-zinc-200">
            {matchStr.slice(1, -1)}
          </code>
        );
      }

      currentIndex = regex.lastIndex;
    }

    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const elements = lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-2" />;
    }

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="text-2xl font-bold font-serif-editorial text-zinc-900 mt-6 mb-2">
          {renderFormattedText(trimmed.replace('## ', ''))}
        </h2>
      );
    }

    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={idx} className="text-3xl font-extrabold font-serif-editorial text-zinc-900 mt-6 mb-3">
          {renderFormattedText(trimmed.replace('# ', ''))}
        </h1>
      );
    }

    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={idx} className="border-l-4 border-zinc-900 pl-4 italic text-zinc-700 font-serif-editorial my-4 py-1.5 bg-zinc-50 rounded-r-lg">
          {renderFormattedText(trimmed.replace('> ', ''))}
        </blockquote>
      );
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <li key={idx} className="ml-6 list-disc text-zinc-800 my-1">
          {renderFormattedText(trimmed.replace(/^[-*]\s+/, ''))}
        </li>
      );
    }

    return (
      <p key={idx} className="my-2.5 text-zinc-800 font-serif-editorial leading-relaxed">
        {renderFormattedText(line)}
      </p>
    );
  });

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
};

export default FormattedContent;
