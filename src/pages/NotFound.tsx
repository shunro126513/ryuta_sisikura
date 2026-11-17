import { Link } from 'react-router-dom';
import { paths } from '../data/catalog';
export default function NotFound() {
  return (
    <div className="page-top on-ink" data-surface="ink">
      <section className="notfound">
        <h1 className="h2">ページが見つかりません</h1>
        <p className="prose">お探しのページは移動または削除された可能性があります。</p>
        <p><Link className="text-link" to={paths.works}>作品の一覧へ →</Link></p>
      </section>
    </div>
  );
}
