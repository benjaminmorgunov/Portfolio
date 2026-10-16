// Вёрстка рядов без обрезки: в каждом ряду фото одной высоты, ширина — по их пропорциям.
// Сумма пропорций ряда (Σ ширина/высота) задаёт его высоту: меньше сумма — крупнее кадры.
// Ряды с маленькой суммой (одиночная вертикаль) не растягиваются на всю ширину,
// а сужаются и смещаются влево/вправо — так появляется осмысленная асимметрия.
import type { Photo } from "./photos";

export type Row = { photos: Photo[]; width: number; align: "start" | "end" | "center" };

export function buildRows(photos: Photo[], pattern: number[], minSum: number): Row[] {
  const groups: Photo[][] = [];
  let cur: Photo[] = [];
  let sum = 0;
  for (const p of photos) {
    const t = pattern[groups.length % pattern.length]!;
    if (cur.length && Math.abs(sum + p.ratio - t) > Math.abs(sum - t) && sum >= t * 0.6) {
      groups.push(cur);
      cur = [];
      sum = 0;
    }
    cur.push(p);
    sum += p.ratio;
    if (sum >= t) {
      groups.push(cur);
      cur = [];
      sum = 0;
    }
  }
  if (cur.length) {
    const prev = groups[groups.length - 1];
    const prevSum = prev?.reduce((s, p) => s + p.ratio, 0) ?? 0;
    if (prev && (sum < minSum * 0.8 || prevSum + sum <= Math.max(...pattern))) prev.push(...cur);
    else groups.push(cur);
  }
  const aligns: Row["align"][] = ["end", "start", "center"];
  let narrow = 0;
  return groups.map((g) => {
    const s = g.reduce((a, p) => a + p.ratio, 0);
    const raw = s / minSum;
    const width = raw > 0.85 ? 1 : raw;
    return { photos: g, width, align: width < 1 ? aligns[narrow++ % aligns.length]! : "center" };
  });
}
