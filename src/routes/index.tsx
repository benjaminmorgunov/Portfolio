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
const layout = [
  "col-span-6 md:col-span-7 md:col-start-1",
  "col-span-4 col-start-3 md:col-span-3 md:col-start-9 md:mt-40",
  "col-span-3 md:col-span-3 md:col-start-2 md:-mt-10",
  "col-span-3 mt-16 md:col-span-4 md:col-start-6 md:mt-24",
  "col-span-6 md:col-span-5 md:col-start-8 md:mt-8",
  "col-span-5 md:col-span-4 md:col-start-1 md:mt-32",
  "col-span-6 md:col-span-8 md:col-start-5 md:-mt-4",
  "col-span-4 col-start-2 md:col-span-2 md:col-start-3 md:mt-20",
  "col-span-6 md:col-span-4 md:col-start-6 md:mt-48",
  "col-span-3 md:col-span-3 md:col-start-10 md:mt-12",
  "col-span-3 mt-10 md:col-span-6 md:col-start-1 md:mt-16",
];
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
            <div className="mx-auto grid max-w-[1500px] grid-cols-6 items-start gap-x-4 gap-y-8 md:grid-cols-12 md:gap-x-8 md:gap-y-12">
              {(s.photos.length ? s.photos : placeholderRatios).map((p, i) =>
                s.photos.length ? (
                  <button key={p} type="button" onClick={() => setOpen(p)} className={`${layout[i % layout.length]} block cursor-zoom-in`}>
                    <img src={p} alt="" loading="lazy" decoding="async" className="block h-auto w-full" />
                  </button>
                ) : (
                  <div key={i} className={`${layout[i % layout.length]} bg-muted`} style={{ aspectRatio: p }} />
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
