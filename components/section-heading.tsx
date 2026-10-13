import type React from "react";

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
    <header className="max-w-2xl">
      <p className="eyebrow">
        <span className="text-white/40">{index} /</span> {eyebrow}
      </p>
      <h2 className="section-title mt-3">{title}</h2>
      {children && <p className="mt-4 text-lg leading-relaxed text-white/75">{children}</p>}
    </header>
  );
}
