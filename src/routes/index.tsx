import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  }),
  component: Index,
});

// Свой ритм рядов для каждого раздела (сумма пропорций кадров в ряду), отдельно для компьютера и телефона.
const desktop = [
  [3.2, 1.9, 3.8, 2.4],
  [2.4, 3.6, 1.7, 3.0],
  [3.0, 1.8, 3.4, 4.0],
  [2.2, 1.4, 3.4, 2.6],
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
  const [onDark, setOnDark] = useState(true);
  const darkEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = darkEnd.current;
    if (!el) return;
    const update = () => setOnDark(el.getBoundingClientRect().top > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <header className="bg-ink">
        {coverImage && (
          <img src={coverImage.src} alt="Вениамин Моргунов — фотография, видеосъёмка, монтаж" width={1880} height={Math.round(1880 / coverImage.ratio)} className="pointer-events-none block h-auto w-full select-none" draggable={false} fetchPriority="high" />
        )}
      </header>

      <nav className={`z-10 px-4 py-4 md:sticky md:top-0 md:px-12 md:py-4 ${onDark ? "bg-ink text-ink-foreground" : "bg-background text-foreground"}`}>
        <ul className="mx-auto grid max-w-[1240px] grid-cols-2 gap-x-4 gap-y-3 text-center text-[11px] leading-tight tracking-[0.14em] uppercase md:flex md:justify-center md:gap-x-12 md:text-xs md:tracking-[0.2em]">
          {sections.map((s) => (
            <li key={s.id}><a href={`#${s.id}`} className="inline-block py-1 hover:opacity-50">{s.title}</a></li>
          ))}
        </ul>
      </nav>

      <div className="h-[22svh] bg-gradient-to-b from-ink to-background md:h-[28svh]" />
      <div ref={darkEnd} />

      <main className="px-3 pb-24 md:px-12 md:pb-36">
        {sections.map((s, si) => (
          <section key={s.id} id={s.id} className={`mx-auto max-w-[1240px] scroll-mt-24 ${si ? "pt-20 md:pt-32" : ""}`}>
            <h2 className="mb-5 text-[13px] tracking-[0.22em] uppercase md:mb-8 md:text-sm md:tracking-[0.26em]">{s.title}</h2>
            <Rows rows={buildRows(s.photos, desktop[si % 4]!, 1.8)} gap="12px" onOpen={setOpen} className="hidden flex-col md:flex" />
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
