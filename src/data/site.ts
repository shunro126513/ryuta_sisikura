/** サイト全体の編集用データ。未入力(null / 空配列)の項目は画面に出ません。 */
export const site = {
  
  artistName: 'Ryuta Sisikura',
  artistNameIsPlaceholder: false,
  /** 公開URL(OG画像・canonical・sitemap用)。ビルド時に VITE_SITE_URL / SITE_URL で上書き */
  url: '',
  title: '作品集',
  description:
    '色彩と手触りの異なる平面・額装・立体作品を、分類ごとに全体と細部から鑑賞できる作品集サイトです。',
  ogImage: 'og.jpg',
  contact: {
    email: null as string | null, // 例: 'name@example.com' を入れると問い合わせリンクが表示される
  },
};

/** 作家について。null / [] の項目は非表示。 */
export const about = {
  introduction: null as string | null,   // 作家の紹介
  philosophy: null as string | null,     // 制作に対する考え
  biography: [] as { year: string; text: string }[],   // 略歴
  exhibitions: [] as { year: string; title: string; venue?: string }[], // 展示歴
  /** 画像から確認できる範囲の観察メモ(編集可)。技法・材料・制作年は書かない */
  observations: [
    '画面には、朱、黄、緑、青といった濃い色が重なり、盛り上がった面、ひび割れた面、光を返す面が一枚の中に同居しています。',
    '額縁にも違いがあり、金色の粒が見えるもの、木肌が見えるもの、白く塗られたものなどがあります。',
    '甲冑の連作は立体で、同じ作品を異なる角度から見ると、角、つば、円形の飾りなど、見る方向によって輪郭が大きく変わります。',
  ],
};
