// Фотографии подключаются автоматически: положите файлы в нужную папку.
// Порядок — по имени файла (01.jpg, 02.jpg …).
type G = Record<string, string>;
const sort = (g: G) =>
  Object.keys(g)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((k) => g[k] as string);


const cover = sort(import.meta.glob("/src/assets/cover/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", { eager: true, import: "default", query: "?url" }) as G);
export const coverImage: string | undefined = cover[0];

export const sections = [
  { id: "sport", title: "Спортивные мероприятия", photos: sort(import.meta.glob("/src/assets/portfolio/1-sport/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", { eager: true, import: "default", query: "?url" }) as G) },
  { id: "education", title: "Образовательные и научные мероприятия", photos: sort(import.meta.glob("/src/assets/portfolio/2-education/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", { eager: true, import: "default", query: "?url" }) as G) },
  { id: "culture", title: "Культурные мероприятия", photos: sort(import.meta.glob("/src/assets/portfolio/3-culture/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", { eager: true, import: "default", query: "?url" }) as G) },
  { id: "art", title: "Художественная фотография", photos: sort(import.meta.glob("/src/assets/portfolio/4-art/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", { eager: true, import: "default", query: "?url" }) as G) },
];
