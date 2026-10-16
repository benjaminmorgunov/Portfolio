import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { coverImage, sections } from "@/lib/photos";
import { buildRows, type Row } from "@/lib/layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Вениамин Моргунов — фотография" },
      { name: "description", content: "Портфолио фотографа Вениамина Моргунова: спортивные, научные и культурные мероприятия, художественная фотография." },
      { property: "og:title", content: "Вениамин Моргунов — фотография" },
      { property: "og:description", content: "Спортивные, научные и культурные мероприятия, художественная фотография." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: coverImage ? [{ rel: "preload", as: "image", href: coverImage.src, fetchpriority: "high" }] : [],
  }),
  component: Index,
});

// Свой ритм рядов для каждого раздела (сумма пропорций кадров в ряду), отдельно для компьютера и телефона.
const desktop = [
  [3.4, 2.2, 4.0, 2.6],
  [2.6, 3.8, 2.0, 3.2],
  [3.2, 2.1, 3.6, 4.2],
  [2.4, 1.6, 3.6, 2.8],
];
const mobile = [
  [1.5, 2.1, 1.3],
  [2.1, 1.5, 1.4],
  [1.5, 1.3, 2.1],
  [1.4, 2.1, 1.5],
];

function Rows({ rows, gap, onOpen, className }: { rows: Row[]; gap: string; onOpen: (s: string) => void; className: string }) {
  return (
    <div className={className} style={{ rowGap: gap }}>
      {rows.map((r, i) => (
        <div key={i} className="flex" style={{ gap, width: `${r.width * 100}%`, alignSelf: r.align }}>
          {r.photos.map((p) => (
            <button key={p.src} type="button" onClick={() => onOpen(p.src)} className="block min-w-0 cursor-zoom-in" style={{ flex: `${p.ratio} 1 0`, aspectRatio: String(p.ratio) }} aria-label="Открыть фотографию">
              <img src={p.src} alt="" loading="lazy" decoding="async" className="block h-full w-full" />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function Index() {
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <div className="bg-ink text-ink-foreground">
        <header className="px-4 pt-6 md:pt-10">
          {coverImage && (
            <img
              src={coverImage.src}
              alt="Вениамин Моргунов — фотография, видеосъёмка, монтаж"
              width={1880}
              height={Math.round(1880 / coverImage.ratio)}
              className="pointer-events-none mx-auto block h-auto max-h-[88svh] w-auto max-w-[min(820px,100%)] select-none"
              draggable={false}
              fetchPriority="high"
            />
          )}
        </header>

        <nav className="px-4 pt-8 pb-6 md:pt-12 md:pb-8">
          <ul className="mx-auto flex max-w-[1180px] flex-wrap items-baseline justify-center gap-x-7 gap-y-3 text-center text-[clamp(12px,3.4vw,15px)] leading-snug tracking-[0.12em] uppercase md:gap-x-10 md:tracking-[0.18em]">
            {sections.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} className="inline-block whitespace-nowrap py-1 hover:opacity-50">{s.title}</a></li>
            ))}
          </ul>
        </nav>
        {/* Чёткая граница с едва заметным бликом на кромке чёрного */}
        <div aria-hidden className="h-px bg-white/[0.08] shadow-[0_1px_3px_rgba(255,255,255,0.05)]" />
      </div>

      <main className="px-3 pt-10 pb-24 md:px-8 md:pt-14 md:pb-36">
        {sections.map((s, si) => (
          <section key={s.id} id={s.id} className={`mx-auto max-w-[1180px] scroll-mt-8 ${si ? "pt-20 md:pt-28" : ""}`}>
            <h2 className="mb-5 text-[clamp(13px,3.8vw,16px)] tracking-[0.2em] uppercase md:mb-7 md:tracking-[0.24em]">{s.title}</h2>
            <Rows rows={buildRows(s.photos, desktop[si % 4]!, 2.0, true)} gap="12px" onOpen={setOpen} className="hidden flex-col md:flex" />
            <Rows rows={buildRows(s.photos, mobile[si % 4]!, 1.0)} gap="6px" onOpen={setOpen} className="flex flex-col md:hidden" />
          </section>
        ))}
      </main>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Фотография" onClick={() => setOpen(null)} className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-background p-3 md:p-10">
          <img src={open} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
