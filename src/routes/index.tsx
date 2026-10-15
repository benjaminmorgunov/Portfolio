import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { coverImage, sections } from "@/lib/photos";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Фотографическое портфолио" },
      { name: "description", content: "Авторское портфолио фотографа: культурные, образовательные и спортивные события, постановочная съёмка и собственные проекты." },
      { property: "og:title", content: "Фотографическое портфолио" },
      { property: "og:description", content: "Авторское портфолио фотографа." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Редакционный ритм: позиции в 12-колоночной сетке (десктоп) и в 6-колоночной (мобильные).
// Журнальный ритм: часть снимков чуть уже и смещена — отступы между фото при этом одинаковые.
const layout = ["w-full", "ml-auto w-4/5", "w-full", "w-3/4", "w-full", "mx-auto w-5/6", "w-full", "ml-auto w-3/4", "w-4/5"];
const placeholderRatios = ["3/2", "2/3", "4/5", "3/2", "1/1", "2/3", "16/9", "4/5", "3/2"];

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
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="flex min-h-svh items-center justify-center p-6 md:p-12">
        {coverImage ? (
          <img src={coverImage} alt="" className="pointer-events-none max-h-[calc(100svh-6rem)] w-auto max-w-full select-none object-contain" draggable={false} fetchPriority="high" />
        ) : (
          <div className="aspect-[3/4] w-full max-w-md bg-muted" />
        )}
      </header>

      <nav className="sticky top-0 z-10 bg-background/95 px-6 py-4 md:px-12">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs tracking-[0.18em] uppercase">
          {sections.map((s) => (
            <li key={s.id}><a href={`#${s.id}`} className="hover:opacity-50">{s.title}</a></li>
          ))}
        </ul>
      </nav>

      <main className="px-5 md:px-12">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-20 pt-28 pb-16 md:pt-44">
            <h2 className="mb-14 text-sm tracking-[0.22em] uppercase md:mb-20">{s.title}</h2>
            <div className="mx-auto max-w-[1400px] columns-2 gap-3 md:columns-3 md:gap-5">
              {(s.photos.length ? s.photos : placeholderRatios).map((p, i) =>
                s.photos.length ? (
                  <button key={p} type="button" onClick={() => setOpen(p ?? null)} className={`${layout[i % layout.length]} mb-3 block break-inside-avoid cursor-zoom-in md:mb-5`}>
                    <img src={p} alt="" loading="lazy" decoding="async" className="block h-auto w-full" />
                  </button>
                ) : (
                  <div key={i} className={`${layout[i % layout.length]} mb-3 break-inside-avoid bg-muted md:mb-5`} style={{ aspectRatio: p }} />
                ),
              )}
            </div>
          </section>
        ))}
      </main>

      {open && (
        <div role="dialog" aria-modal="true" onClick={() => setOpen(null)} className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-background p-4 md:p-10">
          <img src={open} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
