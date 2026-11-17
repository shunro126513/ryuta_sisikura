import { useEffect, useRef, type ReactNode, type ElementType } from 'react';

/** スクロール表示: 短いフェード + わずかな移動。reduced-motion では CSS 側で無効化。 */
export default function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }:
  { children: ReactNode; as?: ElementType; className?: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</Tag>;
}
