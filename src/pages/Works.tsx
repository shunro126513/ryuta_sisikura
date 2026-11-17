import { Link } from 'react-router-dom';
import Artwork from '../components/Artwork';
import Reveal from '../components/Reveal';
import { sections, works, worksOf, paths, workAlt, imageCount, formLabel } from '../data/catalog';

export default function Works() {
  return (
    <div className="page-top on-ink" data-surface="ink">
      <section className="index">
        <h1 className="sr-only">作品</h1>
        <p className="index__lead">{sections.length}の分類 / {works.length}作品・{imageCount}画像</p>
        <ol className="index__list">
          {sections.map((s, i) => {
            const ws = worksOf(s.id);
            const preview = ws.slice(0, 4);
            return (
              <li key={s.id}>
                <Reveal className="index__row">
                  <Link to={paths.section(s.id)} className="index__link" aria-label={`${s.label}（${ws.length}点）`}>
                    <span className="index__no">{String(i + 1).padStart(2, '0')}</span>
                    <span className="index__name">
                      <span className="index__label">{s.label}</span>
                      <span className="index__en">{s.labelEn}・{ws.length}点</span>
                    </span>
                    <span className="index__thumbs" aria-hidden="true">
                      {preview.map((w) => (
                        <span key={w.id} className="index__thumb">
                          <Artwork imageId={w.images[0]} alt="" sizes="(min-width: 900px) 9vw, 20vw" />
                        </span>
                      ))}
                    </span>
                    <span className="index__go" aria-hidden="true">→</span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
