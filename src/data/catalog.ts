import worksJson from './works.json';
import imagesJson from './images.generated.json';

export type Surface = 'ink' | 'stone' | 'cream';
export type Form = 'flat' | 'framed' | 'sculpture';

export interface Section { id: string; folder: string; label: string; labelEn: string; order: number; provisional: boolean }
export interface Work {
  id: string; section: string; order: number;
  images: string[]; imageGroupStatus: 'single' | 'candidate' | 'confirmed';
  provisionalTitle: string; title: string | null; form: Form;
  materials: string | null; dimensions: string | null; year: string | null; description: string | null;
  alt: Record<string, string>; surface: Surface | null; home: boolean;
}
export interface ImageInfo {
  id: string; ratio: number; lum: number; lumLow: number; lumHigh: number;
  sizes: Record<string, number>; dim: Record<string, [number, number]>;
}

export const BASE = import.meta.env.BASE_URL as string;
export const sections = (worksJson.sections as Section[]).slice().sort((a, b) => a.order - b.order);
export const works = (worksJson.works as unknown as Work[]);
const imgs = imagesJson as unknown as Record<string, ImageInfo>;
// 共有用ビルド(share): 配信ファイル数・容量を抑えるため幅1400px超の派生画像は使わない
if (import.meta.env.MODE === 'share') {
  for (const info of Object.values(imgs)) {
    for (const k of Object.keys(info.sizes)) if (info.sizes[k] > 1400) { delete info.sizes[k]; delete info.dim[k]; }
  }
}

export const formLabel: Record<Form, string> = { flat: '平面', framed: '額装', sculpture: '立体' };

export const sectionById = (id: string) => sections.find((s) => s.id === id);
export const worksOf = (sectionId: string) =>
  works.filter((w) => w.section === sectionId).sort((a, b) => a.order - b.order);
/** 全作品の閲覧順(分類順 → 分類内の順) */
export const orderedWorks: Work[] = sections.flatMap((s) => worksOf(s.id));
export const workById = (id: string) => works.find((w) => w.id === id);
export const imageInfo = (id: string) => imgs[id];
export const imageCount = Object.keys(imgs).length;

export function imageSrc(id: string, w: number) { return `${BASE}images/works/${id}-${w}.webp`; }
export function srcSet(id: string) {
  const info = imgs[id];
  return Object.values(info.sizes).map((w) => `${imageSrc(id, w)} ${w}w`).join(', ');
}
export function largest(id: string) { return Math.max(...Object.values(imgs[id].sizes)); }
export function smallest(id: string) { return Math.min(...Object.values(imgs[id].sizes)); }
export function dimsOf(id: string): [number, number] {
  const info = imgs[id]; const k = String(smallest(id)); return info.dim[k];
}

/** 展示面: 手動指定があればそれ。なければ明るさから自動提案(黒い作品→温かいグレー) */
export function surfaceOf(w: Work): Surface {
  if (w.surface) return w.surface;
  const i = imgs[w.images[0]];
  if (i.lum < 0.34 || i.lumLow < 0.1) return 'stone';
  return 'ink';
}
export function workTitle(w: Work) { return w.title ?? w.provisionalTitle; }
export const workAlt = (w: Work, imageId = w.images[0]) => w.alt[imageId] ?? `${workTitle(w)}の全体`;

export function neighbours(w: Work) {
  const i = orderedWorks.findIndex((x) => x.id === w.id);
  return { prev: orderedWorks[i - 1] ?? null, next: orderedWorks[i + 1] ?? null };
}
export const homeFeatures = sections.map((s) => ({
  section: s, work: worksOf(s.id).find((w) => w.home) ?? worksOf(s.id)[0],
}));

export const paths = {
  home: '/', works: '/works/', about: '/about/',
  section: (id: string) => `/works/${id}/`,
  work: (w: Work) => `/works/${w.section}/${w.id}/`,
};
