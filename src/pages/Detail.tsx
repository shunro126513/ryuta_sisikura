import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@radix-ui/themes';
import Artwork from '../components/Artwork';
import ZoomDialog from '../components/ZoomDialog';
import NotFound from './NotFound';
import { workById, sectionById, paths, surfaceOf, workAlt, workTitle, neighbours, formLabel, imageSrc, smallest, worksOf } from '../data/catalog';

export default function Detail() {
  const { section: sid, work: wid } = useParams();
  const w = wid ? workById(wid) : undefined;
  const s = sid ? sectionById(sid) : undefined;
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const zoomBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => { setIdx(0); setOpen(false); }, [wid]);
  const { prev, next } = w ? neighbours(w) : { prev: null, next: null };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (/INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
      if (e.key === 'ArrowLeft' && prev) nav(paths.work(prev));
      if (e.key === 'ArrowRight' && next) nav(paths.work(next));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, prev, next, nav]);
  if (!w || !s || w.section !== s.id) return <NotFound />;
  const surface = surfaceOf(w);
  const id = w.images[idx] ?? w.images[0];
  const siblings = worksOf(s.id);
  const pos = siblings.findIndex((x) => x.id === w.id) + 1;
  const facts: [string, string | null][] = [
    ['分類', `${s.label}（仮）`], ['形式', formLabel[w.form] + '（仮）'],
    ['素材', w.materials], ['寸法', w.dimensions], ['制作年', w.year],
  ];
  return (
    <div className="detail" data-surface={surface}>
      <div className="detail__top">
        <Link to={paths.section(s.id)} className="text-link">← {s.label}の一覧へ戻る</Link>
        <span className="detail__pos">{pos} / {siblings.length}</span>
      </div>
      <div className="detail__main">
        <div className="detail__stage">
          <button type="button" ref={zoomBtn} className="detail__zoom" onClick={() => setOpen(true)} aria-label="この画像を拡大して見る" aria-haspopup="dialog">
            <Artwork imageId={id} alt={workAlt(w, id)} priority fit={{ vh: 76, vw: 66, mvh: 62 }} className="detail__img" />
          </button>
          <Button variant="outline" color="gray" highContrast size="2" className="detail__zoom-btn" onClick={() => setOpen(true)} aria-haspopup="dialog">拡大して見る</Button>
        </div>
        <aside className="detail__info" aria-label="作品情報">
          <h1 className="detail__title">{workTitle(w)}</h1>
          {w.title === null && <p className="detail__note">仮の呼称です</p>}
          <dl className="facts">
            {facts.filter(([, v]) => v).map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
          </dl>
          {w.description && <p className="prose">{w.description}</p>}
          {w.images.length > 1 && (
            <div className="angles">
              <p className="angles__label">別の角度（{w.images.length}画像・仮の整理）</p>
              <ul>
                {w.images.map((im, i) => (
                  <li key={im}>
                    <button type="button" aria-label={`${i + 1}枚目の画像を表示`} aria-current={i === idx ? 'true' : undefined}
                      className={'angles__btn' + (i === idx ? ' is-current' : '')} onClick={() => setIdx(i)}>
                      <img src={imageSrc(im, smallest(im))} alt="" width={72} height={72} loading="lazy" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
      <nav className="detail__pager" aria-label="前後の作品">
        {prev ? <Link to={paths.work(prev)} rel="prev"><span className="pager__dir">← 前の作品</span><span className="pager__name">{sectionById(prev.section)?.label} {String(prev.order).padStart(2, '0')}</span></Link> : <span />}
        <Link to={paths.section(s.id)} className="pager__list">一覧</Link>
        {next ? <Link to={paths.work(next)} rel="next" className="is-next"><span className="pager__dir">次の作品 →</span><span className="pager__name">{sectionById(next.section)?.label} {String(next.order).padStart(2, '0')}</span></Link> : <span />}
      </nav>
      <ZoomDialog work={w} index={idx} setIndex={setIdx} surface={surface} returnFocus={zoomBtn} open={open} onOpenChange={setOpen} />
    </div>
  );
}
