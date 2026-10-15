// Фотографии подключаются автоматически: положите файлы в нужную папку.
// Порядок — по имени файла (01.jpg, 02.jpg …). Пропорции считываются из самих файлов.
import ratios from "virtual:photo-sizes";

export type Photo = { src: string; ratio: number };
type G = Record<string, string>;
const sort = (g: G): Photo[] =>
  Object.keys(g)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((k) => ({ src: g[k] as string, ratio: ratios[k] ?? 1.5 }));

const cover = sort(import.meta.glob("/src/assets/cover/*.{jpg,jpeg,png,JPG,JPEG,PNG}", { eager: true, import: "default", query: "?url" }) as G);
export const coverImage: Photo | undefined = cover[0];

export const sections = [
  { id: "sport", title: "Спортивные мероприятия", photos: sort(import.meta.glob("/src/assets/portfolio/1-sport/*.{jpg,jpeg,png,JPG,JPEG,PNG}", { eager: true, import: "default", query: "?url" }) as G) },
  { id: "science", title: "Научные мероприятия", photos: sort(import.meta.glob("/src/assets/portfolio/2-education/*.{jpg,jpeg,png,JPG,JPEG,PNG}", { eager: true, import: "default", query: "?url" }) as G) },
  { id: "culture", title: "Культурные мероприятия", photos: sort(import.meta.glob("/src/assets/portfolio/3-culture/*.{jpg,jpeg,png,JPG,JPEG,PNG}", { eager: true, import: "default", query: "?url" }) as G) },
  { id: "art", title: "Художественная фотография", photos: sort(import.meta.glob("/src/assets/portfolio/4-art/*.{jpg,jpeg,png,JPG,JPEG,PNG}", { eager: true, import: "default", query: "?url" }) as G) },
];
