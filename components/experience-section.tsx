import { education, experience, skills } from "@/lib/content";
import SectionHeading from "./section-heading";

export default function ExperienceSection() {
  return (
    <section id="experience" className="px-5 py-24 md:px-6">
      <div className="mx-auto grid max-w-content gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div>
          <SectionHeading index="IV" eyebrow="Experience" title="Where I've worked" />

          <ol className="mt-10 border-l border-white/10">
            {experience.map((job) => (
              <li key={job.org} data-reveal className="relative pb-10 pl-7 last:pb-0">
                <span aria-hidden className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-moon bg-ink" />
                <p className="font-mono text-xs text-white/55">{job.period}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  {job.href ? (
                    <a href={job.href} target="_blank" rel="noopener" className="hover:text-moon">
                      {job.org}
                    </a>
                  ) : (
                    job.org
                  )}
                </h3>
                <p className="text-sm text-white/70">{job.role}</p>
                <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-white/75">
                  {job.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <SectionHeading index="IV" eyebrow="Skills" title="Toolkit" />
          <dl className="mt-10 space-y-6">
            {skills.map((s) => (
              <div key={s.group} data-reveal>
                <dt className="text-sm font-medium text-white">{s.group}</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {s.items.map((item) => (
                    <span key={item} className="chip !text-[12px]">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

          <div data-reveal className="card mt-10 p-5">
            <p className="font-mono text-xs text-white/55">{education.period}</p>
            <p className="mt-1 text-sm font-medium text-white">{education.degree}</p>
            <p className="text-sm text-white/70">{education.school}</p>
            <p className="mt-3 text-xs leading-relaxed text-white/60">{education.certs}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
