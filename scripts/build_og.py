#!/usr/bin/env python3
"""OG画像 1200x630: 漆黒の背景にヒーロー作品を contain で配置(作品は変形しない)。"""
from PIL import Image, ImageDraw
import json
m = json.load(open('src/data/images.generated.json'))
iid = 'IMG_7500'
im = Image.open(f'public/images/works/{iid}-{max(m[iid]["sizes"].values())}.webp').convert('RGBA')
bg = Image.new('RGB', (1200, 630), (17, 17, 16))
im.thumbnail((1000, 540))
bg.paste(im, ((1200 - im.width) // 2, (630 - im.height) // 2), im)
bg.save('public/og.jpg', quality=88)
