import React from 'react';

// Matches http(s):// URLs and bare "www." URLs.
const URL_REGEX = /((?:https?:\/\/|www\.)[^\s<]+)/gi;
// Trailing punctuation that shouldn't be treated as part of the link.
const TRAILING = /[.,;:!?)\]}'"]+$/;

/**
 * Convert any URLs inside a plain-text string into clickable <a> elements.
 * Returns an array of React nodes (strings + anchors) safe to render in JSX.
 */
export function linkify(text) {
  if (text == null) return text;
  const str = String(text);
  const nodes = [];
  let lastIndex = 0;
  let match;
  const re = new RegExp(URL_REGEX);

  while ((match = re.exec(str)) !== null) {
    let url = match[0];
    const start = match.index;

    // Peel any trailing punctuation back out of the link.
    let trailing = '';
    const trailMatch = url.match(TRAILING);
    if (trailMatch) {
      trailing = trailMatch[0];
      url = url.slice(0, -trailing.length);
    }

    if (start > lastIndex) nodes.push(str.slice(lastIndex, start));

    const href = url.toLowerCase().startsWith('http') ? url : `https://${url}`;
    nodes.push(
      <a
        key={start}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ color: 'var(--primary)', textDecoration: 'underline', wordBreak: 'break-word' }}
      >
        {url}
      </a>
    );
    if (trailing) nodes.push(trailing);

    lastIndex = start + match[0].length;
  }

  if (lastIndex < str.length) nodes.push(str.slice(lastIndex));
  return nodes;
}
