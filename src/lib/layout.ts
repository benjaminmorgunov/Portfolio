// Вёрстка рядов без обрезки: в каждом ряду фото одной высоты, ширина — по их пропорциям.
// Сумма пропорций ряда (Σ ширина/высота) задаёт его высоту: меньше сумма — крупнее кадры.
// На десктопе (fullWidth) каждый ряд заполняет всю ширину колонки, а последний ряд
// перераспределяется с предыдущим, чтобы не оставалось пустого места справа.
// На телефоне узкие ряды (одиночная вертикаль) сужаются и смещаются влево/вправо.
import type { Photo } from "./photos";

export type Row = { photos: Photo[]; width: number; align: "start" | "end" | "center" };

export function buildRows(photos: Photo[], pattern: number[], minSum: number, fullWidth = false): Row[] {
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
  if (fullWidth) {
    // Балансировка двух последних рядов: переносим кадры из предпоследнего в последний,
    // пока последний ряд не станет достаточно полным.
    const sumOf = (g: Photo[]) => g.reduce((s, p) => s + p.ratio, 0);
    if (groups.length >= 2) {
      const last = groups[groups.length - 1]!;
      const prev = groups[groups.length - 2]!;
      while (prev.length > 1 && sumOf(last) < minSum * 0.9 && sumOf(prev) > minSum * 1.2) {
        last.unshift(prev.pop()!);
      }
    }
    return groups.map((g) => ({ photos: g, width: 1, align: "center" as const }));
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
