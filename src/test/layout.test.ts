import { describe, expect, it } from "vitest";
import { buildRows } from "@/lib/layout";

const ph = (...r: number[]) => r.map((ratio, i) => ({ src: String(i), ratio }));

describe("buildRows", () => {
  it("keeps every photo exactly once, in order", () => {
    const photos = ph(0.67, 1.5, 1.5, 0.67, 1.78, 1.0, 0.67, 1.5);
    const rows = buildRows(photos, [3, 2], 1.8);
    expect(rows.flatMap((r) => r.photos.map((p) => p.src))).toEqual(photos.map((p) => p.src));
  });
  it("narrows a lone vertical photo instead of stretching it full width", () => {
    const rows = buildRows(ph(0.67), [3], 1.8);
    expect(rows[0]!.width).toBeCloseTo(0.67 / 1.8);
  });
  it("keeps at least two photos in every full-width row, including the last", () => {
    for (const count of [2, 3, 4, 5, 12, 21, 28]) {
      for (const pattern of [[2.4, 1.6, 3.6, 2.8], [2.6, 3.8, 2.0, 3.2], [1.4, 2.1, 1.5]]) {
        const photos = ph(...Array.from({ length: count }, (_, i) => [0.67, 1.5, 1.78][i % 3] ?? 1));
        const rows = buildRows(photos, pattern, 2, true);
        expect(rows.every((row) => row.photos.length >= 2)).toBe(true);
        expect(rows.every((row) => row.width === 1)).toBe(true);
        expect(rows.flatMap((row) => row.photos)).toEqual(photos);
      }
    }
  });
});
