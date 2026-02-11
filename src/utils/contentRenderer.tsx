import React from 'react';
import { Link } from 'react-router-dom';

interface TextSegment {
  type: 'text' | 'bold' | 'link';
  content: string;
  to?: string;
}

function parseContent(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  
  // Combined regex for all patterns
  const pattern = /(\*\*(.+?)\*\*)|(\bPHIPA\s+(?:s\.|Section\s*)(\d+(?:\(\d+\))?))|(\bFIPPA\b)|(\bM(?:\/)?FIPPA\b|\bMFIPPA\b)|(\b(?:IPC\s+)?Decision\s+(\d+)\b)|(\b([A-Z][a-z]+(?:\s+(?:and|&)\s+[A-Z][a-z]+)*)\s*\((\d{4})\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // Push preceding text
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }

    if (match[1]) {
      // **bold**
      segments.push({ type: 'bold', content: match[2] });
    } else if (match[3]) {
      // PHIPA s.XX
      segments.push({ type: 'link', content: match[3], to: '/learn/phipa' });
    } else if (match[5]) {
      // FIPPA
      segments.push({ type: 'link', content: match[5], to: '/learn/fippa' });
    } else if (match[6]) {
      // MFIPPA / M/FIPPA
      segments.push({ type: 'link', content: match[6], to: '/learn/mfippa' });
    } else if (match[7]) {
      // Decision 290 / IPC Decision 298
      segments.push({ type: 'link', content: match[7], to: '/ipc-decisions' });
    } else if (match[9]) {
      // Academic citation e.g. Perlin (2019)
      segments.push({
        type: 'link',
        content: match[9],
        to: '/educational-library?tab=academic-foundations',
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}

export function renderContent(text: string): React.ReactNode {
  const segments = parseContent(text);

  return segments.map((seg, i) => {
    switch (seg.type) {
      case 'bold':
        return <strong key={i} className="font-semibold">{seg.content}</strong>;
      case 'link':
        return (
          <Link
            key={i}
            to={seg.to!}
            className="text-[#2E5C8A] underline hover:text-[#2E5C8A]/80 transition-colors"
          >
            {seg.content}
          </Link>
        );
      default:
        return <span key={i}>{seg.content}</span>;
    }
  });
}
