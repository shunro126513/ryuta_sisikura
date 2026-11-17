# 作品集サイト (urushi-site)

React + TypeScript + Vite + Radix Themes。ビルド時に全ページを静的HTML化(SSG)し、検索・共有(OG)に対応します。

## 使い方
```bash
npm install
npm run build      # dist/ に静的サイトを生成 (型チェック → クライアント → SSR → 全ページ事前生成)
npm run preview    # http://127.0.0.1:4173
```
`SITE_URL=https://example.com npm run build` で canonical / og:url / sitemap.xml が出力されます(未指定だと出力しません)。
サブディレクトリ公開は `BASE_PATH=/sub/`。

## 画像(元のPNGは変更しません)
```bash
npm run images   # 元PNG(ARTWORK_DIR、既定 ~/Downloads/sisi_artwork)→ public/images/works/*.webp と src/data/images.generated.json
npm run og       # public/og.jpg
```
- アルファ領域でトリミング(約2.5%の安全余白)、Display P3 → sRGB、幅 400/800/1400/2000(拡大なし)の WebP。
- `dist/images` は `public/images` へのシンボリックリンクです(容量節約)。**公開時は実体を含めてアップロードしてください**(約215MB)。

## データ編集 (すべて src/data/)
| ファイル | 内容 |
|---|---|
| `works.json` | 作品ごとの管理ID・画像・画像グループ・仮/正式タイトル・分類・形式・素材・寸法・制作年・説明・代替テキスト・展示面・トップ掲載(`home`) |
| `works.json` の `sections` | 分類(仮の名称・並び順) |
| `site.ts` | 作家名・説明・公開URL・連絡先メール(未入力なら非表示) |
| `site.ts` の `about` | 紹介・制作について・略歴・展示歴(空の項目は非表示) |
| `details.json` | 「素材と表現」の細部画像(元は `scripts/details.src.json`、`python3 scripts/build_details.py`) |

- `imageGroupStatus: "candidate"` は同一作品の別角度かもしれない画像の **推定**です。確定したら `"confirmed"`、別作品なら `works.json` で作品を分割してください。
- `surface` を `ink | stone | cream` で指定すると、作品の展示面(背景)を固定できます(null は明るさから自動)。
- 新しい作品を足す: PNG を追加 → `npm run images` → `works.json` に1件追加。
- `scripts/init_works.py` は初期データの生成用です。既存の `works.json` は上書きしません。
