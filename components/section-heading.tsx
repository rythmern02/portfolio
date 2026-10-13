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
    <header className="max-w-2xl" data-reveal>
      <p className="eyebrow">
        <span className="text-white/35">{index}</span>
        <span aria-hidden className="mx-2 text-gold/60">
          ✦
        </span>
        {eyebrow}
      </p>
      <h2 className="section-title mt-4">
        <span className="sr-only">{title}</span>
        <span aria-hidden data-decipher={title}>
          {title}
        </span>
      </h2>
      {children && <p className="mt-5 text-lg leading-relaxed text-white/75">{children}</p>}
    </header>
  );
}
