import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { coverImage, sections } from "@/lib/photos";
import { buildRows, type Row } from "@/lib/layout";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

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
    links: coverImage ? [{ rel: "preload", as: "image", href: coverImage.src, fetchPriority: "high", media: "(max-width: 1279px)" }] : [],
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
        <div key={i} data-photo-row className="flex" style={{ gap, width: `${r.width * 100}%`, alignSelf: r.align }}>
          {r.photos.map((p) => {
            const share = p.ratio / r.photos.reduce((total, photo) => total + photo.ratio, 0);
            const gutters = (r.photos.length - 1) * Number.parseFloat(gap);
            const sizes = `(min-width: 1280px) ${(1080 - gutters) * share}px, (min-width: 768px) calc((100vw - ${64 + gutters}px) * ${share}), calc((100vw - ${24 + gutters}px) * ${share})`;
            const img = <img src={p.src} srcSet={p.srcSet} sizes={sizes} alt="" loading="lazy" decoding="async" draggable={false} className="block h-full w-full" />;
            const style = { flex: `${p.ratio} 1 0`, aspectRatio: String(p.ratio) };
            if (p.href) {
              return (
                <a key={p.src} href={p.href} target="_blank" rel="noopener noreferrer" className="photo-button block" style={style} aria-label="Смотреть видео">
                  {img}
                </a>
              );
            }
            return (
              <Button key={p.src} variant="ghost" type="button" onClick={() => onOpen(p.src)} className="photo-button" style={style} aria-label="Открыть фотографию">
                {img}
              </Button>
            );
          })}
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
      <div className="portfolio-top text-ink-foreground">
        <header className="mobile-cover">
          {coverImage && (
            <img
              src={coverImage.src}
              alt="Вениамин Моргунов — фотография, видеосъёмка, монтаж"
              width={1880}
              height={Math.round(1880 / coverImage.ratio)}
              className="pointer-events-none block h-auto w-full select-none"
              draggable={false}
              fetchPriority="high"
            />
          )}
        </header>
        <header className="desktop-masthead">
          <div className="masthead-name">
            <h1><span className="name-first">ВЕНИАМИН</span><span className="name-last">МОРГУНОВ</span></h1>
            <p>ФОТОГРАФИЯ / ВИДЕОСЪЁМКА / МОНТАЖ</p>
          </div>
          <div className="masthead-socials">
            <a href="https://www.instagram.com/batterypoweredlighter/" target="_blank" rel="noopener noreferrer"><Instagram aria-hidden="true" /><span>@batterypoweredlighter</span></a>
            <a href="https://t.me/brassfinisher" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M21.435 2.582a1.2 1.2 0 0 0-1.25-.154L2.15 9.383c-1.232.49-1.22 1.176-.22 1.48l4.628 1.444 1.773 5.542c.214.594.11.83.729.83.477 0 .687-.218.955-.479l2.225-2.163 4.63 3.42c.852.47 1.464.229 1.677-.793l3.034-14.3c.31-1.246-.475-1.812-1.146-1.782ZM8.326 11.975l10.454-6.6c.522-.317 1.002-.147.609.2L10.762 13.36l-.335 3.565-2.101-4.95Z" /></svg><span>@brassfinisher</span></a>
          </div>
          <p className="masthead-year">2026</p>
        </header>

        <nav className="portfolio-nav" aria-label="Разделы портфолио">
          <ul>
            {sections.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} className="inline-block py-1 hover:opacity-50">{s.title}</a></li>
            ))}
          </ul>
        </nav>
        <div aria-hidden className="portfolio-edge" />
      </div>

      <main className="px-3 pt-8 pb-24 md:px-8 md:pt-14 md:pb-36">
        {sections.map((s, si) => (
          <section key={s.id} id={s.id} className={`gallery-section mx-auto scroll-mt-8 ${si ? "pt-20 md:pt-28" : ""}`}>
            <h2 className="mb-5 text-[15px] uppercase md:mb-7 md:text-[16px]">{s.title}</h2>
            <Rows rows={buildRows(s.photos, desktop[si % 4] ?? desktop[0] ?? [], 2.0, true)} gap="12px" onOpen={setOpen} className="hidden flex-col md:flex" />
            <Rows rows={buildRows(s.photos, mobile[si % 4] ?? mobile[0] ?? [], 1.0, true)} gap="6px" onOpen={setOpen} className="flex flex-col md:hidden" />
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
