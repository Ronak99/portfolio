import type { RichLine, RichToken } from "@/data/types";

function renderToken(token: RichToken, key: number) {
  switch (token.type) {
    case "text":
      return <span key={key}>{token.text}</span>;
    case "strong":
      return <strong key={key}>{token.text}</strong>;
    case "link":
      return (
        <a key={key} href={token.href} target="_blank" rel="noopener">
          {token.text}
        </a>
      );
  }
}

export function RichText({ tokens }: { tokens: RichLine }) {
  return <>{tokens.map((token, i) => renderToken(token, i))}</>;
}

export function RichTextBlock({ lines }: { lines: RichLine[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          <RichText tokens={line} />
        </span>
      ))}
    </>
  );
}
