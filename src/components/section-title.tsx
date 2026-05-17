type SectionTitleProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
};

export function SectionTitle({
  id,
  eyebrow,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="mt-4 font-display text-3xl font-black leading-tight text-white sm:text-5xl"
      >
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-white/70">{description}</p>
    </div>
  );
}
