import type React from "react";
import Rise from "./arcane/rise";

export default function SectionHeading({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="max-w-2xl" data-reveal>
      <p className="eyebrow">
        <span className="text-azure">({index})</span> {eyebrow}
      </p>
      <h2 className="section-title mt-4">
        <Rise text={title} />
      </h2>
      {children && <p className="mt-5 text-lg leading-relaxed text-white/70">{children}</p>}
    </header>
  );
}
