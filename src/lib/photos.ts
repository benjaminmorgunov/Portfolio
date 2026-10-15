// Фотографии подключаются автоматически: положите файлы в нужную папку.
// Порядок — по имени файла (01.jpg, 02.jpg …).
type G = Record<string, string>;
const sort = (g: G) =>
  Object.keys(g)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((k) => g[k]);

const opts = { eager: true, import: "default", query: "?url" } as const;

const cover = sort(import.meta.glob("/src/assets/cover/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", opts) as G);
export const coverImage: string | undefined = cover[0];

export const sections = [
  { id: "culture", title: "Культурные мероприятия", photos: sort(import.meta.glob("/src/assets/portfolio/1-culture/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", opts) as G) },
  { id: "education", title: "Образовательные мероприятия", photos: sort(import.meta.glob("/src/assets/portfolio/2-education/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", opts) as G) },
  { id: "sport", title: "Спортивные мероприятия", photos: sort(import.meta.glob("/src/assets/portfolio/3-sport/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", opts) as G) },
  { id: "staged", title: "Постановочная фотография", photos: sort(import.meta.glob("/src/assets/portfolio/4-staged/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", opts) as G) },
  { id: "dogs", title: "Собаки и другие проекты", photos: sort(import.meta.glob("/src/assets/portfolio/5-dogs-projects/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", opts) as G) },
];
