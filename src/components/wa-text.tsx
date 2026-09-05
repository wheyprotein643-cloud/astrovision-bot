function formatChunks(text: string) {
  const parts: { t: string; bold: boolean }[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ t: text.slice(last, m.index), bold: false });
    parts.push({ t: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ t: text.slice(last), bold: false });
  return parts;
}

export function WaText({ text }: { text: string }) {
  return (
    <span className="whitespace-pre-wrap break-words">
      {formatChunks(text).map((p, i) =>
        p.bold ? (
          <strong key={i} className="font-medium">
            {p.t}
          </strong>
        ) : (
          <span key={i}>{p.t}</span>
        ),
      )}
    </span>
  );
}
