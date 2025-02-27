import Link from "next/link";

export function parseMarkdownLinks(text: string): React.ReactNode {
  // Regular expression to match markdown-style links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // If no links found, return the text as is
  if (!linkRegex.test(text)) {
    return text;
  }

  // Reset regex state
  linkRegex.lastIndex = 0;

  // Split the text by markdown links and create React elements
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the link element
    const [fullMatch, linkText, linkUrl] = match;
    parts.push(
      <Link
        key={match.index}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-zinc-300 underline-offset-4 decoration-1 hover:underline inline-flex items-center"
      >
        {linkText}
      </Link>
    );

    lastIndex = match.index + fullMatch.length;
  }

  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
