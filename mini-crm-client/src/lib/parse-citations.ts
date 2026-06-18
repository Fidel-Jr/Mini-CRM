export interface Citation {
  file: string;
  quote: string;
}

export interface ParsedMessage {
  /** Message text with all <citation> tags removed, ready for markdown rendering */
  cleanText: string;
  citations: Citation[];
}

// Mirrors the C# Regex: <citation filename='...'>exact quote</citation>
const CITATION_REGEX = /<citation filename='([^']*)'>(.*?)<\/citation>/g;

/**
 * Strips citation tags out of the raw assistant message and returns them
 * separately, so the remaining text can be handed to a markdown renderer
 * without any XML-ish tags leaking into the rendered output.
 */
export function parseCitations(rawText: string): ParsedMessage {
  const citations: Citation[] = [];

  const cleanText = rawText
    .replace(CITATION_REGEX, (_match, file: string, quote: string) => {
      citations.push({ file, quote: quote.trim() });
      return "";
    })
    .trim();

  return { cleanText, citations };
}