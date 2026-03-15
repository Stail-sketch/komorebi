# 公式アーカイブ デザイン修正指示

## 問題点
現在のデザインが企業サイトっぽく事務的。
NHK教育テレビの子ども番組公式サイト感が足りない。

## 目指すデザイン
2000年代のNHK教育テレビ番組ページ（「おかあさんといっしょ」「いないいないばあっ！」「ピタゴラスイッチ」等の公式ページ）を参考にした、**子ども番組の公式サイト**。

企業感ではなく「子どもに見てもらうための公式ページ」。

## 具体的な修正点

### ヘッダー
- 単調なグラデーションではなく、**イラスト的な装飾**を入れる
- 木漏れ日・木・葉っぱのシルエットをCSSで描く（SVGインライン可）
- タイトルフォントは丸ゴシック系でポップに
- タイトルの周りに星や葉っぱの装飾
- ヘッダー下にキャラクター4体のシルエット or プレースホルダーを横並びに

### 配色
```
メイン背景：#fffef5（温かみのあるクリーム）
ヘッダー背景：#4a8c3f → #5cb85c のグラデ + 木のイラスト
アクセント1：#ff9900（オレンジ・キツネ団長カラー）
アクセント2：#ffcc00（黄色・星や装飾）
アクセント3：#ff6699（ピンク・ぽたまるの頬）
ボタン背景：#66bb6a（明るい緑）
テキスト：#4a3728（茶色系で温かみ）
見出し：#336633 のまま
```

### ナビゲーション
現在：テキストリンクが「|」で区切られている → 事務的

修正後：
```css
.official-nav {
    background-color: #fff8e1; /* 薄い黄色 */
    padding: 10px 0;
    text-align: center;
    border-bottom: 3px dotted #ffcc00; /* 点線でポップに */
}

.official-nav a {
    display: inline-block;
    background-color: #66bb6a;
    color: #ffffff;
    text-decoration: none;
    margin: 3px 5px;
    padding: 6px 16px;
    border-radius: 20px; /* 丸いボタン */
    font-size: 13px;
    font-weight: bold;
    border: 2px solid #4a8c3f;
    transition: background-color 0.2s;
}

.official-nav a:hover {
    background-color: #ff9900; /* ホバーでオレンジに */
    border-color: #e68a00;
    color: #ffffff;
    text-decoration: none;
}
```

### 見出し
現在：左に緑の線だけ → 事務的

修正後：
```css
.section-title {
    font-size: 20px;
    color: #336633;
    padding: 8px 15px;
    margin: 25px 0 15px;
    background-color: #f0f8e8;
    border-radius: 8px;
    border-left: 5px solid #ff9900; /* オレンジのアクセント */
    position: relative;
}

/* 見出しの横に星マーク */
.section-title::before {
    content: "★";
    color: #ffcc00;
    margin-right: 8px;
}
```

### 背景
```css
body {
    background-color: #fffef5;
    /* 薄い水玉パターンをCSSで */
    background-image: radial-gradient(circle, #f0eedd 1px, transparent 1px);
    background-size: 20px 20px;
}
```

### カード（キャラクター紹介等）
```css
.card {
    border: 3px solid #99cc99;
    border-radius: 12px; /* 角丸を強く */
    padding: 15px;
    margin: 15px 0;
    background-color: #ffffff;
    box-shadow: 3px 3px 0px #dde8da; /* ポップな影 */
}
```

### フッター
```css
.official-footer {
    background-color: #4a8c3f;
    color: #d4f0cd;
    padding: 20px 15px;
    text-align: center;
    font-size: 11px;
    margin-top: 40px;
    border-top: 4px solid #ffcc00; /* 黄色の線 */
}

/* フッター上に草や葉っぱの装飾ライン */
.official-footer::before {
    content: "🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿";
    display: block;
    font-size: 16px;
    margin-bottom: 10px;
    letter-spacing: 5px;
}
```

### おしらせ部分
```css
.news-list {
    list-style: none;
}

.news-list li {
    padding: 10px 12px;
    border-bottom: 1px dashed #cce5c5; /* 点線に */
    display: flex;
    align-items: baseline;
    gap: 12px;
}

.news-date {
    color: #999;
    font-size: 12px;
    white-space: nowrap;
}

.news-list li::before {
    content: "🍀";
    font-size: 10px;
}
```

### キャラクター一覧ページ
- 2×2グリッドのサムネイルを**丸い枠**で囲む
- 各キャラのテーマカラーをボーダーに使う
  - キツネ団長：#ff8c00（オレンジ）
  - かあ博士：#555555（ダークグレー）
  - ぽたまる：#d2b48c（タン）
  - うっきち：#b5651d（茶色）
- ホバーで少し拡大（transform: scale(1.05)）

```css
.char-card {
    display: inline-block;
    width: 200px;
    text-align: center;
    margin: 15px;
    padding: 15px;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 3px 3px 0 rgba(0,0,0,0.1);
    transition: transform 0.2s;
}

.char-card:hover {
    transform: scale(1.05);
}

.char-card img,
.char-card .placeholder-character {
    border-radius: 50%; /* 丸い画像 */
    width: 150px;
    height: 150px;
    margin: 0 auto 10px;
    display: block;
}

.char-card .char-name {
    font-size: 16px;
    font-weight: bold;
    color: #336633;
    margin: 8px 0 4px;
}
```

### メインビジュアル（トップページ）
```css
.main-visual {
    background: linear-gradient(135deg, #e8f5e9 0%, #fff8e1 50%, #e8f5e9 100%);
    border: 3px solid #99cc99;
    border-radius: 12px;
    padding: 30px;
    margin: 20px 0;
    text-align: center;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

/* 四隅に葉っぱ装飾 */
.main-visual::before {
    content: "🍃";
    position: absolute;
    top: 10px;
    left: 15px;
    font-size: 24px;
    opacity: 0.5;
}

.main-visual::after {
    content: "🍃";
    position: absolute;
    bottom: 10px;
    right: 15px;
    font-size: 24px;
    opacity: 0.5;
    transform: scaleX(-1);
}
```

### 全体的なフォント
```css
body {
    font-family: "rounded-mplus-1p", "ヒラギノ丸ゴ Pro W4", "ヒラギノ丸ゴ ProN", "Hiragino Maru Gothic Pro", "ＭＳ Ｐゴシック", sans-serif;
}

/* Google Fonts で丸ゴシックを読み込む */
/* <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&display=swap" rel="stylesheet"> */
/* または Kosugi Maru */
/* <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet"> */
```

## 修正後のイメージ（トップページ構成）

```
┌─────────────────────────────────────────┐
│ 🌳🌳 [葉っぱ装飾ヘッダー]  🌳🌳          │
│    ☆★ 木漏れ日遊園地 ★☆                 │
│    きらら放送 毎週土曜 8:30〜9:00          │
├─────────────────────────────────────────┤
│ (トップ) (番組紹介) (キャラクター)          │
│ (スタッフ) (放送リスト) (お問い合わせ)      │  ← 丸いボタン
├─────────────────────────────────────────┤
│                                            │
│  ★ 木漏れ日遊園地へようこそ！              │
│                                            │
│  ┌──────────────────────────┐              │
│  │🍃                        🍃│            │
│  │                              │           │
│  │  [キャラ4体のプレースホルダー]│          │
│  │                              │           │
│  │🍃                        🍃│            │
│  └──────────────────────────┘              │
│                                            │
│  キツネ団長やかあ博士たちと                 │
│  一緒に、楽しく遊んで学ぼう！              │
│                                            │
│  ★ おしらせ                               │
│  🍀 1997.09.20 来週の放送予定について      │
│  🍀 1997.09.13 秋の特別企画のお知らせ      │
│  🍀 ...                                    │
│                                            │
├─────────────────────────────────────────┤
│ 🌿🌿🌿🌿🌿🌿🌿🌿                         │
│ 「木漏れ日遊園地」                          │
│  © YUME STUDIO PRODUCTION                   │
└─────────────────────────────────────────┘
```

## Claude Codeへの指示

official/css/official.css を上記の方針で全面修正してください。
変更点のポイント：
1. ナビゲーションをテキストリンクから丸ボタンに変更
2. 背景に薄い水玉パターン追加
3. 見出しに星マーク＋角丸背景
4. カード類を角丸＋ポップな影に
5. フォントを丸ゴシック系に（Google Fonts使用）
6. アクセントカラーにオレンジ・黄色を追加
7. フッターに葉っぱ装飾
8. メインビジュアルに葉っぱ装飾
9. キャラカードを丸画像＋ホバー拡大に
10. 全体的に「子ども番組の公式サイト」の温かさを出す
