#!/usr/bin/env python3
"""細部画像(全体とは別扱い)。派生WebP(最大サイズ)から指定範囲を切り出す。範囲は trimmed 画像に対する比率 [x,y,w,h]。"""
import json, os
from PIL import Image
IMG = 'public/images/works'; OUT = 'public/images/details'
os.makedirs(OUT, exist_ok=True)
man = json.load(open('src/data/images.generated.json'))
ITEMS = json.load(open('scripts/details.src.json'))
res = []
for it in ITEMS:
    iid = 'IMG_' + it['work']
    wmax = max(man[iid]['sizes'].values())
    im = Image.open(f'{IMG}/{iid}-{wmax}.webp').convert('RGBA')
    W, H = im.size; x, y, w, h = it['box']
    c = im.crop((int(x*W), int(y*H), int((x+w)*W), int((y+h)*H)))
    c.thumbnail((1100, 1100))
    c.save(f'{OUT}/{it["id"]}.webp', 'WEBP', quality=82, method=4)
    res.append({'id': it['id'], 'work': 'w' + it['work'], 'w': c.width, 'h': c.height, 'alt': it['alt'], 'note': it['note']})
json.dump({'items': res}, open('src/data/details.json', 'w'), ensure_ascii=False, indent=1)
