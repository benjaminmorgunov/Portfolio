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
});
