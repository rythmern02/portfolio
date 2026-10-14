import type React from "react";

// Splits text into words that rise out of a mask once an ancestor (or the
// element itself) gets `.is-in`. Screen readers get the plain sentence.
export default function Rise({
  text,
  className = "",
  wordClassName = "",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={`rise ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span className="w">
              <span className={wordClassName} style={{ "--i": i } as React.CSSProperties}>
                {w}
              </span>
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
