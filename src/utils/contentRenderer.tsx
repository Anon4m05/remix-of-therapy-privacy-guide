import React from 'react';
import { Link } from 'react-router-dom';

interface TextSegment {
  type: 'text' | 'bold' | 'link';
  content: string;
  to?: string;
}

// Known academic authors that appear in the educational library
const KNOWN_AUTHORS = [
  'Wexler', 'Winick', 'Perlin', 'Campbell', 'Cerminara', 'Hall',
  'Kawalek', 'Howieson', 'Johnston', 'Arstein-Kerslake', 'Goldberg',
  'McKibbon'
];

function parseContent(text: string): TextSegment[] {
  const segments: TextSegment[] = [];

  // Build author alternation for academic citations
  const authorPattern = KNOWN_AUTHORS.map(a => a.replace('-', '\\-')).join('|');

  // Combined regex for all patterns — order matters (most specific first)
  const pattern = new RegExp(
    '(' +
      // 1: **bold**
      '\\*\\*(.+?)\\*\\*' +
    ')|(' +
      // 3: PHIPA section refs like "PHIPA s.29(1)", "PHIPA s.37(1)(a)", "PHIPA Section 12"
      '\\bPHIPA\\s+(?:s\\.|Section\\s*)(\\d+(?:\\(\\d+\\))?(?:\\([a-z]\\))?)' +
    ')|(' +
      // 5: PHIPA standalone (bare "PHIPA" not followed by s./Section)
      '\\bPHIPA\\b(?!\\s+(?:s\\.|Section|Decision))' +
    ')|(' +
      // 6: FIPPA standalone
      '\\bFIPPA\\b' +
    ')|(' +
      // 7: MFIPPA / M/FIPPA
      '\\bM(?:\\/)?FIPPA\\b|\\bMFIPPA\\b' +
    ')|(' +
      // 8: Health Care Consent Act refs like "Health Care Consent Act s.20"
      '\\bHealth Care Consent Act\\s+s\\.(\\d+(?:\\(\\d+\\))?)' +
    ')|(' +
      // 10: Health Care Consent Act standalone
      '\\bHealth Care Consent Act\\b(?!\\s+s\\.)' +
    ')|(' +
      // 11: IPC Decision / Decision NNN / PHIPA Decision NNN
      '\\b(?:IPC\\s+|PHIPA\\s+)?Decision\\s+(\\d+)\\b' +
    ')|(' +
      // 13: O. Reg. references
      '\\bO\\.\\s*Reg\\.\\s*\\d+\\/\\d+\\s*s\\.\\d+' +
    ')|(' +
      // 14: Known academic citations like "Kawalek (2020)", "Arstein-Kerslake and Black (in McKibbon, 2025)"
      '\\b(' + authorPattern + ')(?:\\s+(?:and|&)\\s+(?:' + authorPattern + '|[A-Z][a-z]+))*\\s*\\((?:in\\s+(?:' + authorPattern + ')\\s*,\\s*)?\\d{4}\\)' +
    ')',
    'g'
  );

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
      // PHIPA s.XX(Y)(z)
      segments.push({ type: 'link', content: match[3], to: '/learn/phipa' });
    } else if (match[5]) {
      // Bare PHIPA
      segments.push({ type: 'link', content: match[5], to: '/learn/phipa' });
    } else if (match[6]) {
      // FIPPA
      segments.push({ type: 'link', content: match[6], to: '/learn/fippa' });
    } else if (match[7]) {
      // MFIPPA / M/FIPPA
      segments.push({ type: 'link', content: match[7], to: '/learn/mfippa' });
    } else if (match[8]) {
      // Health Care Consent Act s.XX
      segments.push({ type: 'link', content: match[8], to: '/learn/phipa' });
    } else if (match[10]) {
      // Health Care Consent Act standalone
      segments.push({ type: 'link', content: match[10], to: '/learn/phipa' });
    } else if (match[11]) {
      // Decision 290 / IPC Decision 298 / PHIPA Decision 301
      segments.push({ type: 'link', content: match[11], to: '/ipc-decisions' });
    } else if (match[13]) {
      // O. Reg. reference
      segments.push({ type: 'link', content: match[13], to: '/learn/phipa' });
    } else if (match[14]) {
      // Academic citation
      segments.push({
        type: 'link',
        content: match[14],
        to: '/educational-library',
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

/**
 * Render a legal reference string (like "PHIPA s.29(1)") as a link.
 * Falls back to plain text if no pattern matches.
 */
export function renderLegalReference(ref: string): React.ReactNode {
  // Determine the link target based on the reference text
  let to: string | null = null;

  if (/PHIPA/i.test(ref)) {
    to = '/learn/phipa';
  } else if (/MFIPPA|M\/FIPPA/i.test(ref)) {
    to = '/learn/mfippa';
  } else if (/FIPPA/i.test(ref)) {
    to = '/learn/fippa';
  } else if (/Health Care Consent Act/i.test(ref)) {
    to = '/learn/phipa';
  } else if (/O\.\s*Reg\./i.test(ref)) {
    to = '/learn/phipa';
  }

  if (to) {
    return (
      <Link
        to={to}
        className="text-[#2E5C8A] underline hover:text-[#2E5C8A]/80 transition-colors"
      >
        {ref}
      </Link>
    );
  }

  return <span>{ref}</span>;
}
