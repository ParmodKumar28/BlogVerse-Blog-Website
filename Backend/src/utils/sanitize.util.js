import sanitizeHtml from "sanitize-html";

const richTextOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr", "span", "div",
    "strong", "b", "em", "i", "u", "s", "strike", "sub", "sup",
    "blockquote", "pre", "code",
    "ul", "ol", "li",
    "a", "img",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    span: ["style"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      ...attribs,
      rel: "noopener noreferrer",
    }),
  },
};

export const sanitizeRichText = (html) =>
  sanitizeHtml(html || "", richTextOptions);

export const stripHtml = (text) =>
  sanitizeHtml(text || "", { allowedTags: [], allowedAttributes: {} }).trim();
