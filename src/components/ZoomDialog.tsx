import { useState, useRef } from 'react';
import { Dialog, IconButton, Button } from '@radix-ui/themes';
import { Cross2Icon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { imageSrc, largest, dimsOf, type Work, workAlt, workTitle, type Surface } from '../data/catalog';

interface Props { work: Work; index: number; setIndex: (i: number) => void; surface: Surface; returnFocus?: React.RefObject<HTMLElement>; open: boolean; onOpenChange: (o: boolean) => void }

/** 拡大ビュー: 閉じるボタン / Esc / フォーカストラップと復帰(Radix Dialog) / 全体⇔等倍の切替 */
export default function ZoomDialog({ work, index, setIndex, surface, returnFocus, open, onOpenChange }: Props) {
  const [full, setFull] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const id = work.images[index];
  const big = largest(id);
  const [w, h] = dimsOf(id);
  const many = work.images.length > 1;
  const go = (d: number) => { setFull(false); setIndex((index + d + work.images.length) % work.images.length); };
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) setFull(false); onOpenChange(o); }}>
      <Dialog.Content className="zoom" data-surface={surface} aria-describedby={undefined}
        onCloseAutoFocus={(e) => { if (returnFocus?.current) { e.preventDefault(); returnFocus.current.focus(); } }}
        onKeyDown={(e) => { if (many && e.key === 'ArrowRight') go(1); if (many && e.key === 'ArrowLeft') go(-1); }}>
        <Dialog.Title className="sr-only">{workTitle(work)} 拡大表示</Dialog.Title>
        <div className="zoom__bar">
          <span className="zoom__count">{many ? `${index + 1} / ${work.images.length}` : ''}</span>
          <div className="zoom__actions">
            <Button variant="outline" color="gray" highContrast size="2" onClick={() => { setFull(!full); scroller.current?.scrollTo(0, 0); }} aria-pressed={full}>
              {full ? '全体を表示' : '等倍で見る'}
            </Button>
            <Dialog.Close>
              <IconButton variant="outline" color="gray" highContrast size="2" aria-label="拡大表示を閉じる"><Cross2Icon /></IconButton>
            </Dialog.Close>
          </div>
        </div>
        <div className={'zoom__stage' + (full ? ' is-full' : '')} ref={scroller} tabIndex={0} aria-label="作品の拡大画像。等倍ではスクロールまたは矢印キーで移動">
          <img
            src={imageSrc(id, big)} alt={workAlt(work, id)}
            width={full ? big : w} height={full ? Math.round(big * h / w) : h}
            className="zoom__img" style={full ? { width: big, maxWidth: 'none', height: 'auto' } : undefined}
          />
        </div>
        {many && (
          <>
            <IconButton className="zoom__nav zoom__nav--prev" variant="ghost" color="gray" highContrast size="3" aria-label="前の画像" onClick={() => go(-1)}><ChevronLeftIcon width="22" height="22" /></IconButton>
            <IconButton className="zoom__nav zoom__nav--next" variant="ghost" color="gray" highContrast size="3" aria-label="次の画像" onClick={() => go(1)}><ChevronRightIcon width="22" height="22" /></IconButton>
          </>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
