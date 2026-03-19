# CLAUDE_CODE_CUSTOM_NIGHT_SCREEN.md
# カスタムナイト選択画面 デザイン指示書

## ⚠️ all_clear.htmlを改修するタスクです。

## 画面の2つの状態

この画面はlocalStorageの状態で表示が変わる：

**状態A：Night6クリア後（yoteidoori_cleared未）**
→ カスタムナイト選択画面。ALL CLEARは表示しない。

**状態B：「予定通り」全クリア後（yoteidoori_cleared = true）**
→ カスタムナイト選択画面 + ALL CLEAR表示 + ★全金色 + PROCESS STILL RUNNING

## 画面レイアウト

### 状態A（Night6クリア後）

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                    CUSTOM NIGHT                          │
│                                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │キツネ │ │かあ  │ │うっ  │ │ぽた  │ │試作  │          │
│  │団長  │ │博士  │ │きち  │ │まる  │ │きつね│          │
│  │      │ │      │ │      │ │      │ │      │          │
│  │[icon]│ │[icon]│ │[icon]│ │[icon]│ │[icon]│          │
│  │      │ │      │ │      │ │      │ │      │          │
│  │◄ 10 ►│ │◄ 10 ►│ │◄ 10 ►│ │◄ 10 ►│ │◄ 10 ►│          │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘          │
│                                                          │
│  ── プリセット ──────────────────────────────             │
│  [放送開始] [フェーズ2] [全員集合] [プロジェクトK]         │
│  [1997年10月] [想定外の出力] [予定通り]                    │
│                                                          │
│  ★☆☆☆☆☆☆                                               │
│                                                          │
│                    [ START ]                              │
│                                                          │
│  [Share on X]                          [最初に戻る]       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 状態B（全クリア後）

状態Aと同じレイアウトだが以下が変化：
- ★が全て金色：★★★★★★★
- 画面最下部に `PROCESS STILL RUNNING` がmonospace・緑テキストで常時表示
- Xシェアの文言が変わる

## HTML構造

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CUSTOM NIGHT</title>
<link rel="stylesheet" href="custom_night.css">
</head>
<body>
<div class="cn-container">

  <!-- タイトル -->
  <h1 class="cn-title">CUSTOM NIGHT</h1>

  <!-- キャラ選択グリッド（5体横並び） -->
  <div class="cn-characters">
    <div class="cn-char" data-char="kitsune">
      <div class="cn-char-icon">
        <img src="../assets/images/icon_kitsune.png" alt="キツネ団長">
      </div>
      <p class="cn-char-name">キツネ団長</p>
      <div class="cn-slider">
        <button class="cn-btn-minus">◄</button>
        <span class="cn-level" id="level-kitsune">0</span>
        <button class="cn-btn-plus">►</button>
      </div>
    </div>

    <div class="cn-char" data-char="kaa">
      <div class="cn-char-icon">
        <img src="../assets/images/icon_kaa.png" alt="かあ博士">
      </div>
      <p class="cn-char-name">かあ博士</p>
      <div class="cn-slider">
        <button class="cn-btn-minus">◄</button>
        <span class="cn-level" id="level-kaa">0</span>
        <button class="cn-btn-plus">►</button>
      </div>
    </div>

    <div class="cn-char" data-char="ukkichi">
      <div class="cn-char-icon">
        <img src="../assets/images/icon_ukkichi.png" alt="うっきち">
      </div>
      <p class="cn-char-name">うっきち</p>
      <div class="cn-slider">
        <button class="cn-btn-minus">◄</button>
        <span class="cn-level" id="level-ukkichi">0</span>
        <button class="cn-btn-plus">►</button>
      </div>
    </div>

    <div class="cn-char" data-char="potamaru">
      <div class="cn-char-icon">
        <img src="../assets/images/icon_potamaru.png" alt="ぽたまる">
      </div>
      <p class="cn-char-name">ぽたまる</p>
      <div class="cn-slider">
        <button class="cn-btn-minus">◄</button>
        <span class="cn-level" id="level-potamaru">0</span>
        <button class="cn-btn-plus">►</button>
      </div>
    </div>

    <div class="cn-char" data-char="shisaku">
      <div class="cn-char-icon">
        <img src="../assets/images/icon_shisaku.png" alt="試作きつね">
      </div>
      <p class="cn-char-name">試作きつね</p>
      <div class="cn-slider">
        <button class="cn-btn-minus">◄</button>
        <span class="cn-level" id="level-shisaku">0</span>
        <button class="cn-btn-plus">►</button>
      </div>
    </div>
  </div>

  <!-- プリセット -->
  <div class="cn-presets">
    <p class="cn-presets-label">プリセット</p>
    <div class="cn-preset-buttons">
      <button class="cn-preset" data-preset="housou">放送開始</button>
      <button class="cn-preset" data-preset="phase2">フェーズ2</button>
      <button class="cn-preset" data-preset="zenin">全員集合</button>
      <button class="cn-preset" data-preset="projectk">プロジェクトK</button>
      <button class="cn-preset" data-preset="1997">1997年10月</button>
      <button class="cn-preset" data-preset="soutei">想定外の出力</button>
      <button class="cn-preset" data-preset="yoteidoori">予定通り</button>
    </div>
  </div>

  <!-- 星 -->
  <div class="cn-stars" id="cn-stars">
    <!-- JSで動的に生成 -->
  </div>

  <!-- STARTボタン -->
  <button class="cn-start" id="cn-start">START</button>

  <!-- 下部ボタン -->
  <div class="cn-bottom">
    <button class="cn-share" id="cn-share">Share on X</button>
    <button class="cn-back" id="cn-back">最初に戻る</button>
  </div>

  <!-- 全クリア後のみ表示 -->
  <div class="cn-process" id="cn-process" style="display: none;">
    PROCESS STILL RUNNING
  </div>

</div>

<script src="custom_night.js"></script>
</body>
</html>
```

## CSS

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: #0c0c10;
  color: #c8c4bc;
  font-family: 'Courier New', monospace;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cn-container {
  width: 100%;
  max-width: 900px;
  padding: 40px 24px;
  text-align: center;
}

/* タイトル */
.cn-title {
  font-size: 1.8rem;
  letter-spacing: 0.2em;
  color: #e8e4dc;
  margin-bottom: 40px;
}

/* キャラグリッド */
.cn-characters {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.cn-char {
  width: 140px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #222;
  padding: 16px 8px 12px;
  transition: border-color 0.3s;
}

.cn-char:hover {
  border-color: #444;
}

.cn-char-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
  border-radius: 4px;
  overflow: hidden;
  background: #111;
}

.cn-char-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.3);
}

.cn-char-name {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.75rem;
  color: #999;
  margin-bottom: 10px;
  letter-spacing: 0.05em;
}

/* AIレベルスライダー */
.cn-slider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cn-btn-minus,
.cn-btn-plus {
  background: none;
  border: 1px solid #333;
  color: #888;
  width: 28px;
  height: 28px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cn-btn-minus:hover,
.cn-btn-plus:hover {
  border-color: #666;
  color: #ccc;
}

.cn-level {
  font-size: 1.2rem;
  color: #e8e4dc;
  min-width: 32px;
  text-align: center;
}

/* レベルが0の時は暗く */
.cn-char[data-active="false"] .cn-char-icon img {
  filter: grayscale(1) brightness(0.4);
}

.cn-char[data-active="false"] .cn-char-name {
  color: #555;
}

.cn-char[data-active="false"] .cn-level {
  color: #555;
}

/* レベルが20の時は赤く */
.cn-char[data-maxed="true"] .cn-level {
  color: #c44;
}

.cn-char[data-maxed="true"] {
  border-color: #522;
}

/* プリセット */
.cn-presets {
  margin-bottom: 24px;
}

.cn-presets-label {
  font-size: 0.75rem;
  color: #555;
  margin-bottom: 10px;
  letter-spacing: 0.1em;
}

.cn-preset-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.cn-preset {
  background: none;
  border: 1px solid #2a2a2e;
  color: #888;
  padding: 6px 14px;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cn-preset:hover {
  border-color: #555;
  color: #ccc;
}

/* クリア済みプリセットに★マーク */
.cn-preset.cleared::after {
  content: ' ★';
  color: #c90;
}

/* 「予定通り」は特別な見た目 */
.cn-preset[data-preset="yoteidoori"] {
  border-color: #533;
  color: #a66;
}

.cn-preset[data-preset="yoteidoori"]:hover {
  border-color: #855;
  color: #c88;
}

/* 星 */
.cn-stars {
  margin-bottom: 24px;
  font-size: 1.2rem;
  letter-spacing: 0.3em;
}

.cn-stars .star-empty {
  color: #333;
}

.cn-stars .star-filled {
  color: #c90;
}

/* 全クリア後は金色 */
.cn-stars .star-gold {
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}

/* STARTボタン */
.cn-start {
  display: block;
  margin: 0 auto 32px;
  background: none;
  border: 2px solid #c90;
  color: #c90;
  padding: 12px 60px;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.3s;
}

.cn-start:hover {
  background: rgba(204, 153, 0, 0.1);
  box-shadow: 0 0 15px rgba(204, 153, 0, 0.2);
}

/* 下部ボタン */
.cn-bottom {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 40px;
}

.cn-share,
.cn-back {
  background: none;
  border: 1px solid #2a2a2e;
  color: #666;
  padding: 8px 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cn-share:hover,
.cn-back:hover {
  border-color: #555;
  color: #999;
}

/* PROCESS STILL RUNNING（全クリア後のみ） */
.cn-process {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #4a4;
  letter-spacing: 0.1em;
  animation: process-blink 3s infinite;
}

@keyframes process-blink {
  0%, 90%, 100% { opacity: 1; }
  95% { opacity: 0.5; }
}
```

## JavaScript

```javascript
// プリセットデータ
const PRESETS = {
  housou:     { kitsune: 10, kaa: 10, ukkichi: 0,  potamaru: 0,  shisaku: 0  },
  phase2:     { kitsune: 10, kaa: 10, ukkichi: 10, potamaru: 0,  shisaku: 0  },
  zenin:      { kitsune: 10, kaa: 10, ukkichi: 10, potamaru: 10, shisaku: 0  },
  projectk:   { kitsune: 15, kaa: 15, ukkichi: 15, potamaru: 15, shisaku: 0  },
  '1997':     { kitsune: 15, kaa: 15, ukkichi: 15, potamaru: 15, shisaku: 15 },
  soutei:     { kitsune: 10, kaa: 10, ukkichi: 10, potamaru: 10, shisaku: 20 },
  yoteidoori: { kitsune: 20, kaa: 20, ukkichi: 20, potamaru: 20, shisaku: 20 }
};

const CHARS = ['kitsune', 'kaa', 'ukkichi', 'potamaru', 'shisaku'];
const levels = { kitsune: 0, kaa: 0, ukkichi: 0, potamaru: 0, shisaku: 0 };

// レベル更新
function updateLevel(char, delta) {
  levels[char] = Math.max(0, Math.min(20, levels[char] + delta));
  document.getElementById('level-' + char).textContent = levels[char];
  
  const charEl = document.querySelector(`.cn-char[data-char="${char}"]`);
  charEl.setAttribute('data-active', levels[char] > 0 ? 'true' : 'false');
  charEl.setAttribute('data-maxed', levels[char] === 20 ? 'true' : 'false');
}

// ◄►ボタン
document.querySelectorAll('.cn-char').forEach(charEl => {
  const char = charEl.dataset.char;
  charEl.querySelector('.cn-btn-minus').addEventListener('click', () => updateLevel(char, -1));
  charEl.querySelector('.cn-btn-plus').addEventListener('click', () => updateLevel(char, 1));
  charEl.setAttribute('data-active', 'false');
});

// プリセットボタン
document.querySelectorAll('.cn-preset').forEach(btn => {
  btn.addEventListener('click', () => {
    const preset = PRESETS[btn.dataset.preset];
    CHARS.forEach(char => {
      levels[char] = preset[char];
      document.getElementById('level-' + char).textContent = levels[char];
      const charEl = document.querySelector(`.cn-char[data-char="${char}"]`);
      charEl.setAttribute('data-active', levels[char] > 0 ? 'true' : 'false');
      charEl.setAttribute('data-maxed', levels[char] === 20 ? 'true' : 'false');
    });
  });
});

// クリア済みプリセットに★
Object.keys(PRESETS).forEach(key => {
  if (localStorage.getItem('custom_' + key + '_cleared') === 'true') {
    const btn = document.querySelector(`.cn-preset[data-preset="${key}"]`);
    if (btn) btn.classList.add('cleared');
  }
});

// 星の表示
function renderStars() {
  const starsEl = document.getElementById('cn-stars');
  const allGold = localStorage.getItem('yoteidoori_cleared') === 'true';
  let html = '';
  
  Object.keys(PRESETS).forEach(key => {
    const cleared = localStorage.getItem('custom_' + key + '_cleared') === 'true';
    if (allGold) {
      html += cleared ? '<span class="star-gold">★</span>' : '<span class="star-empty">☆</span>';
    } else {
      html += cleared ? '<span class="star-filled">★</span>' : '<span class="star-empty">☆</span>';
    }
  });
  
  starsEl.innerHTML = html;
}
renderStars();

// PROCESS STILL RUNNING（全クリア後のみ）
if (localStorage.getItem('yoteidoori_cleared') === 'true') {
  document.getElementById('cn-process').style.display = 'block';
}

// STARTボタン
document.getElementById('cn-start').addEventListener('click', () => {
  // レベルデータをlocalStorageに保存してゲーム画面に遷移
  localStorage.setItem('custom_levels', JSON.stringify(levels));
  
  // どのプリセットに一致するか判定（クリア判定用）
  let matchedPreset = null;
  Object.entries(PRESETS).forEach(([key, preset]) => {
    if (CHARS.every(c => levels[c] === preset[c])) {
      matchedPreset = key;
    }
  });
  localStorage.setItem('custom_current_preset', matchedPreset || 'custom');
  
  window.location.href = '（カスタムナイトゲームのパス）';
});

// Xシェアボタン
document.getElementById('cn-share').addEventListener('click', () => {
  const allCleared = localStorage.getItem('yoteidoori_cleared') === 'true';
  
  let text;
  if (allCleared) {
    text = 'こもれびゆうえんち。全クリア!!　#こもれびゆうえんち #ARG';
  } else {
    text = 'こもれびゆうえんち。クリア　#こもれびゆうえんち #ARG';
  }
  
  const url = '（ゲームURL）';
  window.open(
    `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    '_blank'
  );
});

// 最初に戻る
document.getElementById('cn-back').addEventListener('click', () => {
  window.location.href = '（noteのURL）';
});
```

## キャラアイコン画像

以下の画像ファイルが必要：
- `official/assets/images/icon_kitsune.png` — キツネ団長のアイコン（80x80程度）
- `official/assets/images/icon_kaa.png` — かあ博士のアイコン
- `official/assets/images/icon_ukkichi.png` — うっきちのアイコン
- `official/assets/images/icon_potamaru.png` — ぽたまるのアイコン
- `official/assets/images/icon_shisaku.png` — 試作きつねのアイコン（暗い・不気味な見た目）

画像がまだない場合はプレースホルダ（黒背景＋白文字でキャラ名）で仮置き。

## 確認チェックリスト

### 状態A（Night6クリア後）
- [ ] CUSTOM NIGHTタイトルが表示されるか
- [ ] 5体のキャラアイコンが横並びで表示されるか
- [ ] ◄►ボタンでレベル0〜20を操作できるか
- [ ] レベル0のキャラアイコンが暗くなるか
- [ ] レベル20のキャラのレベル表示が赤くなるか
- [ ] 7つのプリセットボタンが表示されるか
- [ ] プリセットクリックでレベルが一括変更されるか
- [ ] ★☆が正しく表示されるか
- [ ] STARTボタンが機能するか
- [ ] Xシェアが「こもれびゆうえんち。クリア　#こもれびゆうえんち #ARG」で投稿されるか
- [ ] 「最初に戻る」がnoteに飛ぶか
- [ ] ALL CLEARが表示されないこと
- [ ] PROCESS STILL RUNNINGが表示されないこと

### 状態B（全クリア後）
- [ ] ★が全て金色に光っているか
- [ ] PROCESS STILL RUNNINGが画面下部に表示されるか（緑文字・点滅）
- [ ] Xシェアが「こもれびゆうえんち。全クリア!!　#こもれびゆうえんち #ARG」で投稿されるか
- [ ] クリア済みプリセットに★マークが付いているか
