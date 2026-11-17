import { site } from './data/site';
import { sectionById, workById, workTitle, workAlt, sections, orderedWorks, paths, worksOf, BASE, imageCount } from './data/catalog';

export interface Head { title: string; description: string; path: string; image?: string; noindex?: boolean }

export function routeHead(pathname: string): Head {
  const p = pathname.replace(BASE.replace(/\/$/, ''), '').replace(/\/+$/, '') || '/';
  const parts = p.split('/').filter(Boolean);
  const T = (t: string) => `${t} | ${site.title}`;
  if (parts.length === 0) return { title: `${site.title}｜色彩と質感の作品を見る`, description: site.description, path: '/' };
  if (parts[0] === 'about') return { title: T('作家について'), description: '作家の紹介と、作品から見える特徴。', path: '/about/' };
  if (parts[0] === 'works') {
    if (parts.length === 1) return { title: T('作品'), description: `${sections.length}の分類に整理した${imageCount}点の作品画像の一覧。`, path: '/works/' };
    const s = sectionById(parts[1]);
    if (s && parts.length === 2) return { title: T(s.label), description: `${s.label}に分類した作品${worksOf(s.id).length}点。`, path: paths.section(s.id) };
    const w = workById(parts[2]);
    if (s && w) return {
      title: T(workTitle(w)),
      description: workAlt(w), path: paths.work(w),
    };
  }
  return { title: T('ページが見つかりません'), description: site.description, path: '/404', noindex: true };
}

export function allRoutes(): string[] {
  return ['/', '/works/', '/about/', ...sections.map((s) => paths.section(s.id)), ...orderedWorks.map((w) => paths.work(w))];
}
