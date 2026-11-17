import { dimsOf, srcSet, imageSrc, smallest, imageInfo } from '../data/catalog';

interface Props {
  imageId: string;
  alt: string;
  sizes?: string;
  /** 高さ制限で収まる表示のとき、実際の描画幅(min(vw, vh×縦横比))から sizes を計算する */
  fit?: { vh: number; vw: number; mvh: number };
  priority?: boolean;
  className?: string;
}
/** 作品の全体画像。アルファ余白だけをトリミング済みの派生WebPを contain で表示する。 */
export default function Artwork({ imageId, alt, sizes, fit, priority, className }: Props) {
  const [w, h] = dimsOf(imageId);
  const r = imageInfo(imageId).ratio;
  const computed = fit ? `(min-width: 900px) min(${fit.vw}vw, ${(fit.vh * r).toFixed(1)}vh), min(92vw, ${(fit.mvh * r).toFixed(1)}vh)` : sizes;
  return (
    <img
      className={`artwork ${className ?? ''}`}
      src={imageSrc(imageId, smallest(imageId))}
      srcSet={srcSet(imageId)}
      sizes={computed}
      width={w}
      height={h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
      draggable={false}
    />
  );
}
