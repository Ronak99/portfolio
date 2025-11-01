import Link from "next/link";
import React from "react";

export function parseMarkdownLinks(text: string): React.ReactNode {
  // Handle newlines by splitting the text and processing each line
  if (text.includes("\n")) {
    const lines = text.split("\n");
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {parseMarkdownInLine(line)}
      </React.Fragment>
    ));
  }

  // If no newlines, process the entire text as a single line
  return parseMarkdownInLine(text);
}

// Helper function to parse markdown (bold, italic, links) in a single line
function parseMarkdownInLine(text: string): React.ReactNode {
  // Create a token array to store all markdown elements
  interface Token {
    type: 'text' | 'bold' | 'italic' | 'link';
    content: string;
    url?: string;
    index: number;
    length: number;
  }

  const tokens: Token[] = [];
  
  // Find all markdown elements: bold (**text**), italic (*text*), and links [text](url)
  // Process bold first (has priority), then italic, then links
  
  // Match bold: **text** (two asterisks on each side)
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let match: RegExpExecArray | null;
  while ((match = boldRegex.exec(text)) !== null) {
    tokens.push({
      type: 'bold',
      content: match[1],
      index: match.index,
      length: match[0].length
    });
  }

  // Match italic: *text* (single asterisk, but not part of bold)
  // Match single asterisks, ensuring they're not part of double asterisks
  const italicRegex = /\*([^*]+?)\*/g;
  while ((match = italicRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const matchLength = match[0].length;
    
    // Check if this is part of a bold token (preceded or followed by asterisk)
    const charBefore = matchIndex > 0 ? text[matchIndex - 1] : '';
    const charAfter = matchIndex + matchLength < text.length ? text[matchIndex + matchLength] : '';
    const isPartOfBold = charBefore === '*' || charAfter === '*';
    
    // Check if this italic is not overlapping with a bold token
    const isOverlapping = isPartOfBold || tokens.some(t => 
      t.type === 'bold' && 
      matchIndex >= t.index - 1 && 
      matchIndex <= t.index + t.length
    );
    
    if (!isOverlapping) {
      tokens.push({
        type: 'italic',
        content: match[1],
        index: matchIndex,
        length: matchLength
      });
    }
  }

  // Match links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  while ((match = linkRegex.exec(text)) !== null) {
    // Check if this link is not overlapping with bold or italic tokens
    const isOverlapping = tokens.some(t => 
      match!.index >= t.index && 
      match!.index < t.index + t.length
    );
    if (!isOverlapping) {
      tokens.push({
        type: 'link',
        content: match[1],
        url: match[2],
        index: match.index,
        length: match[0].length
      });
    }
  }

  // Sort tokens by index
  tokens.sort((a, b) => a.index - b.index);

  // If no tokens found, return text as is
  if (tokens.length === 0) {
    return text;
  }

  // Build React elements from tokens
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let keyCounter = 0;

  for (const token of tokens) {
    // Add text before the token
    if (token.index > lastIndex) {
      const beforeText = text.substring(lastIndex, token.index);
      if (beforeText) {
        parts.push(beforeText);
      }
    }

    // Add the token element
    switch (token.type) {
      case 'bold':
        parts.push(
          <strong key={`token-${keyCounter++}`} className="font-semibold text-zinc-300">
            {parseMarkdownInLine(token.content)}
          </strong>
        );
        break;
      case 'italic':
        parts.push(
          <em key={`token-${keyCounter++}`} className="italic">
            {parseMarkdownInLine(token.content)}
          </em>
        );
        break;
      case 'link':
        parts.push(
          <Link
            key={`token-${keyCounter++}`}
            href={token.url!}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 underline-offset-4 decoration-1 hover:underline inline-flex items-center"
          >
            {token.content}
          </Link>
        );
        break;
    }

    lastIndex = token.index + token.length;
  }

  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length === 1 ? parts[0] : parts;
}
