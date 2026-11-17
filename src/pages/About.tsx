import { Link } from 'react-router-dom';
import Artwork from '../components/Artwork';
import { about, site } from '../data/site';
import { paths, workById, workAlt } from '../data/catalog';

export default function About() {
  const strip = ['w7459', 'w7365', 'w7411'].map((i) => workById(i)!).filter(Boolean);
  const hasProfile = about.introduction || about.philosophy || about.biography.length || about.exhibitions.length;
  return (
    <div className="about" data-surface="cream">
      <div className="about__inner">
        <h1 className="about__title">作家について</h1>
        {about.introduction && <section className="about__sec"><h2 className="h3">紹介</h2><p className="prose">{about.introduction}</p></section>}
        {about.philosophy && <section className="about__sec"><h2 className="h3">制作について</h2><p className="prose">{about.philosophy}</p></section>}
        {about.biography.length > 0 && <section className="about__sec"><h2 className="h3">略歴</h2>
          <dl className="timeline">{about.biography.map((b, i) => <div key={i}><dt>{b.year}</dt><dd>{b.text}</dd></div>)}</dl></section>}
        {about.exhibitions.length > 0 && <section className="about__sec"><h2 className="h3">展示歴</h2>
          <dl className="timeline">{about.exhibitions.map((b, i) => <div key={i}><dt>{b.year}</dt><dd>{b.title}{b.venue ? `（${b.venue}）` : ''}</dd></div>)}</dl></section>}
        {about.observations.length > 0 && <section className="about__sec"><h2 className="h3">作品から見えること</h2>
          {about.observations.map((t, i) => <p className="prose" key={i}>{t}</p>)}</section>}
        {!hasProfile && <p className="about__pending">プロフィール、略歴、展示歴は準備中です。</p>}
        {site.contact.email && <section className="about__sec"><h2 className="h3">お問い合わせ</h2>
          <p className="prose">展示・取材・制作のご相談は、メールでお寄せください。</p>
          <p><a className="text-link" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p></section>}
        <p><Link className="text-link" to={paths.works}>作品を見る →</Link></p>
      </div>
      <div className="about__strip" aria-hidden="false">
        {strip.map((w) => (
          <Link key={w.id} to={paths.work(w)} className="about__strip-item" aria-label="作品の詳細へ">
            <Artwork imageId={w.images[0]} alt={workAlt(w)} sizes="(min-width: 900px) 24vw, 30vw" />
          </Link>
        ))}
      </div>
    </div>
  );
}
