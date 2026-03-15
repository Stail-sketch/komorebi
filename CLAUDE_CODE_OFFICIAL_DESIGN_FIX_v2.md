# 公式アーカイブ デザイン大幅修正指示

## 今の問題
まだ大人向けの企業サイトっぽい。もっと子ども番組のサイトに振り切る必要がある。

## 目指すもの
2000年代のNHK教育テレビの番組サイトそのもの。
「おかあさんといっしょ」「いないいないばあっ！」「にほんごであそぼ」の公式ページを参考に。
子どもが見て「わー！」ってなるサイト。大人が作るけど子どもが使う前提のデザイン。

## 具体的にやること

### 1. 背景をめちゃくちゃにぎやかに
- 白背景を完全にやめる
- 空色（水色）のグラデーション背景
- 雲、星、葉っぱ、花などのパターンをCSS/SVGで散りばめる
- 地面ラインに草むらのイラスト風ボーダー

```css
body {
    background: linear-gradient(180deg, #87CEEB 0%, #b5e8f7 40%, #d4f5d4 80%, #90EE90 100%);
    background-attachment: fixed;
    min-height: 100vh;
}

/* 雲をCSS疑似要素で浮かべる */
.cloud {
    position: fixed;
    background: white;
    border-radius: 50px;
    opacity: 0.6;
    z-index: 0;
}
.cloud::before, .cloud::after {
    content: '';
    position: absolute;
    background: white;
    border-radius: 50%;
}
```

### 2. ヘッダーを番組のセットみたいにする
- 木や草のシルエットをヘッダーの両端に配置
- タイトルを虹色 or カラフルな縁取り文字に
- キャラクター4体をヘッダーに大きく配置（立ち絵を左右に）
- 「あそびにきてくれてありがとう！」的なウェルカムメッセージ

```css
.official-header {
    background: linear-gradient(to bottom, #228B22, #32CD32);
    padding: 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
    min-height: 200px;
    border-bottom: 8px solid #FFD700;
}

.official-header h1 {
    font-size: 36px;
    color: #FFD700;
    text-shadow: 
        3px 3px 0 #228B22,
        -1px -1px 0 #228B22,
        1px -1px 0 #228B22,
        -1px 1px 0 #228B22;
    letter-spacing: 6px;
}

/* ヘッダーの左右にキャラ立ち絵 */
.header-char-left {
    position: absolute;
    left: 20px;
    bottom: 0;
    height: 180px;
}
.header-char-right {
    position: absolute;
    right: 20px;
    bottom: 0;
    height: 180px;
}
```

### 3. ナビゲーションをおもちゃっぽく
- 各ボタンを積み木やブロックのような形に
- キャラのアイコンを各ボタンに付ける
- ホバーで跳ねるアニメーション
- 色をバラバラにする（赤、青、黄、緑、オレンジ、紫）

```css
.official-nav {
    background: rgba(255,255,255,0.8);
    padding: 15px;
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    border-bottom: 4px dashed #FFD700;
}

.official-nav a {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 15px;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;
    color: #fff;
    border: 3px solid rgba(0,0,0,0.15);
    box-shadow: 0 4px 0 rgba(0,0,0,0.2);
    transition: transform 0.15s, box-shadow 0.15s;
    position: relative;
    top: 0;
}

.official-nav a:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 0 rgba(0,0,0,0.2);
    text-decoration: none;
}

.official-nav a:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 rgba(0,0,0,0.2);
}

/* 各ボタンの色 */
.official-nav a:nth-child(1) { background: #FF6B6B; } /* トップ：赤 */
.official-nav a:nth-child(2) { background: #4ECDC4; } /* 番組紹介：ティール */
.official-nav a:nth-child(3) { background: #FFB347; } /* キャラ：オレンジ */
.official-nav a:nth-child(4) { background: #87CEEB; } /* スタッフ：水色 */
.official-nav a:nth-child(5) { background: #DDA0DD; } /* 放送リスト：紫 */
.official-nav a:nth-child(6) { background: #98D8C8; } /* お問い合わせ：ミント */
```

### 4. コンテンツエリアを看板・立て札風に
- 白い四角ではなく、木の看板風フレーム
- 角丸を極端に大きく（20px以上）
- 影をポップに
- セクション間にキャラが顔を出す

```css
.content-area {
    max-width: 900px;
    margin: 20px auto;
    background: rgba(255,255,255,0.92);
    border-radius: 25px;
    border: 4px solid #8B4513;
    box-shadow: 
        0 6px 0 #6B3410,
        0 8px 20px rgba(0,0,0,0.15);
    padding: 30px;
    position: relative;
    z-index: 1;
}
```

### 5. 見出しをもっと派手に
- 見出しの背景を吹き出し風 or リボン風
- アイコンをキャラの顔にする
- フォントサイズを大きく

```css
.section-title {
    font-size: 24px;
    color: #fff;
    background: #FF6B6B;
    display: inline-block;
    padding: 8px 30px;
    border-radius: 30px;
    margin: 25px 0 15px;
    box-shadow: 0 3px 0 #cc5555;
    position: relative;
}

/* 見出しの横に星 */
.section-title::before {
    content: "⭐";
    margin-right: 8px;
}
.section-title::after {
    content: "⭐";
    margin-left: 8px;
}
```

### 6. キャラクター紹介ページの改善
- 2×2グリッドではなくキャラが舞台に立ってる風
- 各キャラの周りにそのキャラのテーマカラーの装飾
- 吹き出しでキャラのセリフが出る
- カードのボーダーを虹色やストライプに

```css
.char-card {
    background: #fff;
    border-radius: 20px;
    padding: 20px;
    margin: 15px;
    text-align: center;
    border: 4px solid;
    box-shadow: 0 5px 0 rgba(0,0,0,0.15);
    transition: transform 0.2s;
    position: relative;
}

.char-card:hover {
    transform: translateY(-5px) rotate(-1deg);
}

/* キャラのセリフ吹き出し */
.char-speech {
    background: #FFFACD;
    border: 2px solid #FFD700;
    border-radius: 15px;
    padding: 8px 15px;
    margin-top: 10px;
    font-size: 13px;
    position: relative;
}
.char-speech::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    margin-left: -8px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 10px solid #FFD700;
}

/* キツネ団長 */
.char-card.kitsune { border-color: #FF8C00; }
/* かあ博士 */
.char-card.kaa { border-color: #555; }
/* ぽたまる */
.char-card.potamaru { border-color: #D2B48C; }
/* うっきち */
.char-card.ukkichi { border-color: #B5651D; }
```

### 7. おしらせ部分
- 掲示板風ではなく、キャラが持ってる看板風
- 各項目の頭にキツネ団長の顔アイコン

### 8. フッター
- 草むら＋空のイラスト風
- 「またあそびにきてね！」のメッセージ
- キャラが手を振ってるイメージ

```css
.official-footer {
    background: linear-gradient(to bottom, #90EE90, #228B22);
    color: #fff;
    padding: 30px 15px 20px;
    text-align: center;
    font-size: 12px;
    position: relative;
    border-top: 6px solid #FFD700;
}

.official-footer::before {
    content: "🌳🌿🌸🌿🌳🌿🌸🌿🌳";
    display: block;
    font-size: 24px;
    margin-bottom: 10px;
    letter-spacing: 8px;
}

.footer-message {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #FFD700;
}
```

### 9. ページ遷移時のちょっとした演出
```css
/* ページ読み込み時にふわっと表示 */
.content-area {
    animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### 10. 全体のフォント
```html
<link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet">
```
```css
body {
    font-family: 'Kosugi Maru', 'ヒラギノ丸ゴ Pro', 'Hiragino Maru Gothic Pro', sans-serif;
}
```

## イメージ比較

### Before（今）
- 白背景
- 緑のグラデヘッダー
- テキストリンクナビ
- 企業っぽい整然さ

### After（目指す）
- 空＋草原の背景
- キャラが並ぶヘッダー
- カラフルな積み木ボタン
- 子どもが「うわー！」ってなる楽しさ
- 看板・吹き出し・星・虹
- 遊園地のゲートをくぐるような体験

## Claude Codeへの指示

official/ 以下のHTML/CSSを上記方針で全面改修してください。
重要ポイント：
1. 背景を空色グラデーション＋雲に変更
2. ヘッダーにキャラ立ち絵を配置（normal画像を使用）
3. ナビを各色バラバラの丸ボタンに（ホバーで跳ねる）
4. コンテンツを角丸25px＋木枠風ボーダー
5. 見出しをリボン風＋星マーク
6. キャラ紹介に吹き出しセリフ追加
7. フッターに草＋「またあそびにきてね！」
8. フォントを丸ゴシック（Kosugi Maru）
9. 全体的に「子ども番組の遊園地」の世界観を出す
