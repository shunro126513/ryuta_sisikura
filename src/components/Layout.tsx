import { NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { Link as RLink } from '@radix-ui/themes';
import { site } from '../data/site';
import { paths } from '../data/catalog';
import { routeHead } from '../seo';

function ScrollAndHead() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const h = routeHead(pathname);
    document.title = h.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', h.description);
  }, [pathname]);
  return null;
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollAndHead />
      <a className="skip-link" href="#main">本文へ移動</a>
      <header className="site-header on-ink" data-surface="ink">
        <div className="site-header__inner">
          <Link to={paths.home} className="site-header__name">{site.artistName}</Link>
          <nav aria-label="主要メニュー" className="site-nav">
            <NavLink to={paths.works} className={({ isActive }) => 'site-nav__link' + (isActive ? ' is-current' : '')}>作品</NavLink>
            <NavLink to={paths.about} className={({ isActive }) => 'site-nav__link' + (isActive ? ' is-current' : '')}>作家について</NavLink>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>{children}</main>
      <footer className="site-footer on-ink" data-surface="ink">
        <div className="site-footer__inner">
          <p className="site-footer__name">{site.artistName}</p>
          <nav aria-label="フッター" className="site-footer__nav">
            <Link to={paths.works}>作品</Link>
            <Link to={paths.about}>作家について</Link>
            {site.contact.email && <RLink asChild underline="always"><a href={`mailto:${site.contact.email}`}>お問い合わせ</a></RLink>}
          </nav>
        </div>
      </footer>
    </>
  );
}
