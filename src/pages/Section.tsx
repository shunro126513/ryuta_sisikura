import { Link, useParams } from 'react-router-dom';
import Artwork from '../components/Artwork';
import Reveal from '../components/Reveal';
import NotFound from './NotFound';
import { sectionById, worksOf, paths, workAlt, sections, formLabel } from '../data/catalog';

const DESK = [7, 5, 4, 4, 4, 5, 7, 6, 6, 4, 8, 4, 4, 4];
const MOB = [2, 1, 1, 2, 1, 1];

/** 12列(スマホ2列)の編集的な配置。最後の不完全な行は残り枚数で均等割り。 */
function plan(n: number) {
  const out: { d: number; dStart?: number; m: number }[] = [];
  let i = 0, k = 0;
  while (i < n) {
    // デスクトップ: パターンに従い、1行ぶん取り出す
    let row: number[] = [], sum = 0, j = k;
    while (i + row.length < n && sum < 12) { row.push(DESK[j % DESK.length]); sum += row[row.length - 1]; j++; }
    if (sum !== 12 || row.length === 0) { /* パターン上は必ず12 */ }
    k = j;
    const left = n - i;
    if (row.length > left) { // 余りの行
      const c = left; const base = Math.floor(12 / c);
      row = Array.from({ length: c }, () => base);
      if (c === 1) { out.push({ d: 6, dStart: 4, m: 2 }); i += 1; continue; }
    }
    row.forEach((s) => out.push({ d: s, m: 1 }));
    i += row.length;
  }
  out.forEach((o, idx) => { o.m = MOB[idx % MOB.length]; });
  if (out.length) { const last = out[out.length - 1]; if (out.length % 2 === 0 && last.m === 1 && MOB[(out.length - 1) % MOB.length] === 1) { /* ペアの片割れが欠けないよう */ } }
  return out.slice(0, n);
}

export default function Section() {
  const { section: sid } = useParams();
  const s = sid ? sectionById(sid) : undefined;
  if (!s) return <NotFound />;
  const ws = worksOf(s.id);
  const p = plan(ws.length);
  const idx = sections.findIndex((x) => x.id === s.id);
  const prev = sections[idx - 1], next = sections[idx + 1];
  return (
    <>
      <div className="section-head on-ink" data-surface="ink">
        <div className="section-head__inner">
          <Link to={paths.works} className="text-link">← 作品</Link>
          <h1 className="section-head__title">{s.label}<span>{s.labelEn} / {ws.length}点</span></h1>
        </div>
      </div>
      <div className="wall" data-surface="stone">
        <ul className="wall__grid">
          {ws.map((w, i) => {
            const pl = p[i];
            return (
              <li key={w.id} className="wall__cell"
                style={{ ['--span' as string]: pl.d, ['--span-m' as string]: pl.m, ...(pl.dStart ? { ['--start' as string]: pl.dStart } : {}) }}>
                <Reveal className="work-tile">
                  <Link to={paths.work(w)} className="work-tile__link" aria-label={`${w.title ?? w.provisionalTitle}（${formLabel[w.form]}${w.images.length > 1 ? `・${w.images.length}画像` : ''}）の詳細へ`}>
                    <span className="work-tile__art">
                      <Artwork imageId={w.images[0]} alt={workAlt(w)}
                        sizes={`(min-width: 700px) ${Math.round(pl.d / 12 * 92)}vw, 80vw`} />
                    </span>
                    <span className="work-tile__cap">
                      <span>{String(i + 1).padStart(2, '0')}{w.images.length > 1 && <em> ・{w.images.length}画像</em>}</span>
                      <span className="work-tile__go">詳細 →</span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <nav className="section-pager" aria-label="分類の移動">
          {prev ? <Link to={paths.section(prev.id)}>← {prev.label}</Link> : <span />}
          <Link to={paths.works}>分類の一覧</Link>
          {next ? <Link to={paths.section(next.id)}>{next.label} →</Link> : <span />}
        </nav>
      </div>
    </>
  );
}
