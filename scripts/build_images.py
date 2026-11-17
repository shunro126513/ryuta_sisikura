#!/usr/bin/env python3
"""元PNG(保持)から Web 用 WebP 派生画像を作る。
- アルファ領域に沿ってトリミング(安全余白つき)  - Display P3 → sRGB 変換
- 480/960/1600/2400 の複数サイズ(拡大しない)     - 結果は src/data/images.generated.json に出力
"""
import os, glob, io, json, sys
from PIL import Image, ImageCms, ImageOps
SRC = os.environ.get('ARTWORK_DIR', '/Users/shunro/Downloads/sisi_artwork')
OUT = 'public/images/works'
WIDTHS = [400, 800, 1400, 2000]
Q = {400: 80, 800: 80, 1400: 79, 2000: 77}
srgb = ImageCms.createProfile('sRGB')

def to_srgb(im):
    icc = im.info.get('icc_profile')
    if not icc: return im
    try:
        src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
        a = im.getchannel('A')
        rgb = ImageCms.profileToProfile(im.convert('RGB'), src, srgb, renderingIntent=0, outputMode='RGB')
        rgb.putalpha(a); return rgb
    except Exception as e:
        print('icc fail', e); return im

def process(f):
    folder = os.path.basename(os.path.dirname(f))
    iid = os.path.basename(f).split('_transparent')[0]          # IMG_7421
    im = Image.open(f)
    icc = im.info.get('icc_profile')
    im = ImageOps.exif_transpose(im)   # EXIFの向きを反映(ファイルを開いたときと同じ向き)
    if icc: im.info['icc_profile'] = icc
    im = im.convert('RGBA') if im.mode != 'RGBA' else im
    im = to_srgb(im)
    a = im.getchannel('A')
    bb = a.point(lambda v: 255 if v > 6 else 0).getbbox()
    W, H = im.size
    pad = int(max(bb[2]-bb[0], bb[3]-bb[1]) * 0.025) + 6
    box = (max(0, bb[0]-pad), max(0, bb[1]-pad), min(W, bb[2]+pad), min(H, bb[3]+pad))
    im = im.crop(box)
    w, h = im.size
    # 明るさ(不透明部の平均輝度)→ 展示面の自動提案
    sm = im.resize((max(1, w//16), max(1, h//16)))
    px = [(r*0.2126+g*0.7152+b*0.0722)/255 for r,g,b,al in sm.getdata() if al > 200]
    lum = sum(px)/len(px) if px else .5
    # 外周(縁)付近の輝度 = 背景との同化判定に使う
    srt = sorted(px)
    p15 = srt[int(len(srt)*.15)] if srt else lum
    p85 = srt[int(len(srt)*.85)] if srt else lum
    sizes = {}
    for tw in WIDTHS:
        if tw > w and tw != WIDTHS[0] and sizes:
            if any(v['w'] == w for v in sizes.values()): continue
        tw_eff = min(tw, w)
        if tw_eff in [v['w'] for v in sizes.values()]: continue
        th = round(h * tw_eff / w)
        r = im.resize((tw_eff, th), Image.LANCZOS) if tw_eff != w else im
        path = f'{OUT}/{iid}-{tw_eff}.webp'
        r.save(path, 'WEBP', quality=Q[tw], alpha_quality=85, method=4)
        sizes[str(tw_eff)] = {'w': tw_eff, 'h': th, 'bytes': os.path.getsize(path)}
    entry = {
        'id': iid, 'folder': folder, 'ratio': round(w/h, 4),
        'lum': round(lum, 3), 'lumLow': round(p15, 3), 'lumHigh': round(p85, 3),
        'sizes': {k: v['w'] for k, v in sizes.items()},
        'dim': {k: [v['w'], v['h']] for k, v in sizes.items()},
    }
    print(iid, folder, (w, h), 'lum', round(lum, 2), list(sizes), flush=True)
    return iid, entry
if __name__ == '__main__':
  from multiprocessing import Pool
  os.makedirs(OUT, exist_ok=True)
  files = sorted(glob.glob(f'{SRC}/*/*_transparent.png'))
  with Pool(6) as p: manifest = dict(p.map(process, files, chunksize=1))
  json.dump(manifest, open('src/data/images.generated.json', 'w'), ensure_ascii=False, indent=1)
  tot = sum(os.path.getsize(p) for p in glob.glob(OUT + '/*.webp'))
  print('files', len(manifest), 'total MB', round(tot/1e6, 1))
