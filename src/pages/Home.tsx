import { Link } from 'react-router-dom';
import { Button } from '@radix-ui/themes';
import Artwork from '../components/Artwork';
import Reveal from '../components/Reveal';
import { homeFeatures, paths, workAlt, workById, sections, imageCount, works, imageSrc, BASE } from '../data/catalog';
import { site, about } from '../data/site';
import details from '../data/details.json';

export const HERO_WORK_ID = 'w7500';

/** 一行(row)の構成: single=大きく1点, pair=2点を高さをずらして並置 */
const ROWS: { kind: 'single' | 'pair'; side?: 'l' | 'r' }[] = [
  { kind: 'single', side: 'l' }, { kind: 'pair' }, { kind: 'single', side: 'r' }, { kind: 'pair' },
  { kind: 'single', side: 'l' }, { kind: 'pair' }, { kind: 'single', side: 'r' }, { kind: 'pair' },
  { kind: 'single', side: 'l' }, { kind: 'pair' },
];
function layout() {
  const out: { kind: 'single' | 'pair'; side?: 'l' | 'r'; items: typeof homeFeatures }[] = [];
  let i = 0;
  for (const r of ROWS) {
    const n = r.kind === 'single' ? 1 : 2;
    out.push({ ...r, items: homeFeatures.slice(i, i + n) }); i += n;
  }
  if (i < homeFeatures.length) out.push({ kind: 'single', side: 'r', items: homeFeatures.slice(i) });
  return out.filter((r) => r.items.length);
}

function Feature({ f, index, big }: { f: (typeof homeFeatures)[number]; index: number; big?: boolean }) {
  const { section, work } = f;
  const count = works.filter((w) => w.section === section.id).length;
  return (
    <Link to={paths.section(section.id)} className="feature__link" aria-label={`${section.label}の作品一覧へ（${count}点）`}>
      <div className="feature__art">
        <Artwork imageId={work.images[0]} alt={workAlt(work)} className="feature__img"
          fit={big ? { vh: 70, vw: 58, mvh: 56 } : { vh: 50, vw: 34, mvh: 52 }} />
      </div>
      <div className="feature__meta">
        <span className="feature__no">{String(index + 1).padStart(2, '0')}</span>
        <span className="feature__label">{section.label}</span>
        <span className="feature__en">{section.labelEn}</span>
        <span className="feature__count">{count}点</span>
        <span className="feature__go" aria-hidden="true">一覧を見る →</span>
      </div>
    </Link>
  );
}

export default function Home() {
  const hero = workById(HERO_WORK_ID)!;
  const rows = layout();
  let n = 0;
  return (
    <>
      <section className="hero on-ink" data-surface="ink" aria-labelledby="hero-h">
        <div className="hero__inner">
          <div className="hero__text">
            <h1 id="hero-h" className="eyebrow">作品集</h1>
            <p className="hero__lead">{sections.length}の分類、{imageCount}点の画像。全体から細部まで、ゆっくり鑑賞できます。</p>
            <div className="hero__cta">
              <Button asChild size="3" variant="outline" color="gray" highContrast radius="small"><Link to={paths.works}>作品を見る</Link></Button>
            </div>
          </div>
          <Link to={paths.work(hero)} className="hero__art" aria-label="この作品の詳細を見る">
            <Artwork imageId={hero.images[0]} alt={workAlt(hero)} priority fit={{ vh: 80, vw: 62, mvh: 56 }} className="hero__img" />
          </Link>
          <p className="hero__vertical" aria-hidden="true">作品集</p>
        </div>
      </section>

      <section className="features" aria-label="分類ごとの代表作品">
        <Reveal className="features__intro"><p>分類ごとに、代表となる作品を一点ずつ。気になる作品から、一覧へ進めます。</p></Reveal>
        {rows.map((r, ri) => {
          const items = r.items.map((f) => ({ f, i: n++ }));
          // 行ごとに 漆黒 / 生成り を交互に。作品の見え方は確認済み(代表作は中間の明るさ)
          const surface = ri % 2 === 0 ? 'ink' : 'cream';
          return (
            <div key={ri} className={`feature-row feature-row--${r.kind} ${r.side ? 'is-' + r.side : ''}`} data-surface={surface}>
              <div className="feature-row__inner">
                {items.map(({ f, i }, k) => (
                  <Reveal key={f.section.id} className={`feature feature--${k}`} delay={k * 90}>
                    <Feature f={f} index={i} big={r.kind === 'single'} />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="material on-ink" data-surface="ink" aria-labelledby="material-h">
        <div className="material__inner">
          <Reveal className="material__head">
            <p className="eyebrow">素材と表現</p>
            <h2 id="material-h" className="h2">全体と、表面の細部</h2>
            <p className="prose">作品全体の姿と、表面を拡大した部分を並べています。拡大した部分は全体とは別の見え方として扱い、画像の切り出し位置を示しています。</p>
          </Reveal>
          {details.items.map((d, i) => {
            const w = workById(d.work)!;
            return (
              <Reveal key={d.id} className={`detail-pair ${i % 2 ? 'is-flip' : ''}`}>
                <Link to={paths.work(w)} className="detail-pair__whole" aria-label={`${w.provisionalTitle}の詳細へ`}>
                  <Artwork imageId={w.images[0]} alt={workAlt(w)} sizes="(min-width: 900px) 30vw, 70vw" className="detail-pair__whole-img" />
                  <span className="tag">全体</span>
                </Link>
                <figure className="detail-pair__crop">
                  <img src={`${BASE}images/details/${d.id}.webp`} width={d.w} height={d.h} loading="lazy" decoding="async" alt={d.alt} />
                  <figcaption><span className="tag tag--gold">細部</span>{d.note}</figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="about-teaser" aria-labelledby="about-t">
        <Reveal className="about-teaser__inner">
          <p className="eyebrow">作家について</p>
          <h2 id="about-t" className="h2">作品から見えること</h2>
          <p className="prose">{about.observations[0]}</p>
          <p><Link className="text-link" to={paths.about}>作家について →</Link></p>
          {site.contact.email && <p><a className="text-link" href={`mailto:${site.contact.email}`}>展示・取材・制作のご相談</a></p>}
        </Reveal>
      </section>
    </>
  );
}
