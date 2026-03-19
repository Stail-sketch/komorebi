# CLAUDE_CODE_CUSTOM_NIGHT_GAME.md
# カスタムナイトゲーム 実装指示書

## ⚠️ Night6のゲームコードをベースに改造するタスクです。新規作成ではありません。

## 概要

カスタムナイト選択画面（custom_night.html）で設定したAIレベル（0〜20）を読み込み、
そのレベルに応じた難易度でゲームを実行する。
ゲームの基本的な仕組みはNight6と同じ（カメラ・シャッター・時計・5体のキャラ）。

## 実装方針

**Night6のゲームファイル（HTML/CSS/JS）をコピーして改造する。**

1. Night6のゲームファイルをコピー → `game/custom_night_game.html` として配置
2. AIレベルを固定値から変数に差し替え
3. localStorageからレベルを読み込む処理を追加
4. クリア後の遷移先を変更
5. 試作きつねの出現確率をレベル依存に変更

## ファイル構成

```
game/
├── custom_night.html          ← カスタムナイト選択画面（作成済み）
├── custom_night.css           ← 選択画面のCSS（作成済み）
├── custom_night.js            ← 選択画面のJS（作成済み）
├── custom_night_game.html     ← ★このタスクで作成（Night6コピー＋改造）
└── custom_night_game.js       ← ★このタスクで作成（Night6のJSコピー＋改造）
```

## 手順

### 手順1：Night6のゲームファイルをコピー

```bash
cp game/night6.html game/custom_night_game.html
cp game/night6.js game/custom_night_game.js
# CSSはNight6と共通で良い（またはコピー）
```

custom_night_game.htmlのscript参照をcustom_night_game.jsに変更。
titleを「CUSTOM NIGHT」に変更。

### 手順2：AIレベルの読み込み

custom_night_game.jsの冒頭に以下を追加：

```javascript
// カスタムナイト選択画面から渡されたAIレベルを読み込む
const customLevels = JSON.parse(localStorage.getItem('custom_levels') || '{}');
const currentPreset = localStorage.getItem('custom_current_preset') || 'custom';

// 各キャラのAIレベル（0〜20）
const AI_LEVEL = {
  kitsune:  customLevels.kitsune  || 0,
  kaa:      customLevels.kaa      || 0,
  ukkichi:  customLevels.ukkichi  || 0,
  potamaru: customLevels.potamaru || 0,
  shisaku:  customLevels.shisaku  || 0
};
```

### 手順3：AIレベルをゲームロジックに反映

Night6のゲームJSには、各キャラの行動パラメータが固定値で定義されているはず。
これらをAI_LEVELに応じた変数に差し替える。

#### 共通の変換ルール

AIレベル0〜20を各パラメータに変換する関数を用意：

```javascript
// AIレベル（0〜20）を移動間隔（ミリ秒）に変換
// レベル0＝動かない、レベル1＝非常にゆっくり、レベル20＝最速
function levelToMoveInterval(level) {
  if (level === 0) return Infinity; // 動かない
  // レベル1: 15秒間隔 → レベル20: 2秒間隔
  return Math.max(2000, 15000 - (level - 1) * (13000 / 19));
}

// AIレベル（0〜20）を攻撃確率（0〜1）に変換
// 各移動判定時に実際に移動するかの確率
function levelToMoveProbability(level) {
  if (level === 0) return 0;
  // レベル1: 30% → レベル20: 95%
  return 0.30 + (level - 1) * (0.65 / 19);
}

// AIレベル（0〜20）を攻撃待機時間（ミリ秒）に変換
// ドアに到着してから攻撃までの猶予時間
function levelToAttackDelay(level) {
  if (level === 0) return Infinity;
  // レベル1: 8秒猶予 → レベル20: 1秒猶予
  return Math.max(1000, 8000 - (level - 1) * (7000 / 19));
}
```

#### キツネ団長

```javascript
// Night6の固定値を変数に差し替え
const kitsune = {
  active: AI_LEVEL.kitsune > 0,
  moveInterval: levelToMoveInterval(AI_LEVEL.kitsune),
  moveProbability: levelToMoveProbability(AI_LEVEL.kitsune),
  // 時計の減少速度もレベルに依存
  // レベル0: 減らない、レベル1: 非常にゆっくり減る、レベル20: 高速で減る
  clockDecayRate: AI_LEVEL.kitsune === 0 ? 0 : 0.5 + (AI_LEVEL.kitsune / 20) * 4.5,
  // 時計が0になった時の猶予（レベルが高いほど短い）
  clockGracePeriod: AI_LEVEL.kitsune === 0 ? Infinity : Math.max(1000, 5000 - (AI_LEVEL.kitsune - 1) * (4000 / 19))
};
```

#### かあ博士

```javascript
const kaa = {
  active: AI_LEVEL.kaa > 0,
  moveInterval: levelToMoveInterval(AI_LEVEL.kaa),
  moveProbability: levelToMoveProbability(AI_LEVEL.kaa),
  attackDelay: levelToAttackDelay(AI_LEVEL.kaa)
};
```

#### うっきち

```javascript
const ukkichi = {
  active: AI_LEVEL.ukkichi > 0,
  moveInterval: levelToMoveInterval(AI_LEVEL.ukkichi),
  moveProbability: levelToMoveProbability(AI_LEVEL.ukkichi),
  attackDelay: levelToAttackDelay(AI_LEVEL.ukkichi),
  // うっきちはカメラの映像と反対側から来る特性はレベルに関係なく維持
  invertSide: true
};
```

#### ぽたまる

```javascript
const potamaru = {
  active: AI_LEVEL.potamaru > 0,
  // ぽたまるは音楽トリガーなので移動間隔ではなくトリガー頻度
  // レベル0: トリガーなし、レベル1: 30秒間隔、レベル20: 5秒間隔
  triggerInterval: AI_LEVEL.potamaru === 0 ? Infinity : Math.max(5000, 30000 - (AI_LEVEL.potamaru - 1) * (25000 / 19)),
  // 反応猶予時間（音が鳴ってからシャッターを閉めるまでの猶予）
  // レベル1: 3秒 → レベル20: 0.5秒
  reactionWindow: AI_LEVEL.potamaru === 0 ? Infinity : Math.max(500, 3000 - (AI_LEVEL.potamaru - 1) * (2500 / 19))
};
```

#### 試作きつね

```javascript
const shisaku = {
  active: AI_LEVEL.shisaku > 0,
  // 試作きつねの出現確率は本編Night6では時間経過で上がったが、
  // カスタムナイトではAIレベルで固定
  // レベル0: 出現しない、レベル1: 2%、レベル20: 25%
  spawnChance: AI_LEVEL.shisaku === 0 ? 0 : 0.02 + (AI_LEVEL.shisaku - 1) * (0.23 / 19),
  // 撃退猶予時間
  // レベル1: 15秒 → レベル20: 5秒
  despawnTimer: AI_LEVEL.shisaku === 0 ? Infinity : Math.max(5000, 15000 - (AI_LEVEL.shisaku - 1) * (10000 / 19)),
  // 出現トリガー：シャッターを閉じるたびに判定（本編と同じ）
  triggerOnShutter: true
};
```

### 手順4：レベル0のキャラを無効化

AIレベルが0のキャラは完全に無効化する：
- 移動ロジックをスキップ
- カメラに映らない
- 攻撃判定なし
- ジャンプスケアなし

```javascript
// 各キャラの移動ループ内で
function characterMoveLoop(character) {
  if (!character.active) return; // レベル0なら何もしない
  
  // 移動判定...
  setTimeout(() => characterMoveLoop(character), character.moveInterval);
}
```

### 手順5：ゲーム時間の統一

カスタムナイトのゲーム時間はNight6と同じ：
- 12AM〜6AM
- 各時間帯の長さも同じ

ただし、本編Night6では時間経過で試作きつねの確率が上がったが、
カスタムナイトではAIレベルで固定。時間経過による変動なし。

### 手順6：クリア後の処理

```javascript
function onCustomNightClear() {
  // ゲーム停止
  stopAllGameActivity();
  
  // 6AM表示
  showSixAM();
  
  // プリセット判定
  const preset = localStorage.getItem('custom_current_preset');
  
  if (preset === 'yoteidoori') {
    // 「予定通り」プリセット → 特別演出
    // CLAUDE_CODE_ENDING_RESTRUCTURE.md の yoteidooriClearEnding() を実行
    localStorage.setItem('custom_yoteidoori_cleared', 'true');
    yoteidooriClearEnding();
  } else if (preset && preset !== 'custom') {
    // 既存プリセット → ★獲得 + クリア画面
    localStorage.setItem('custom_' + preset + '_cleared', 'true');
    showPresetClearScreen(preset);
  } else {
    // カスタム設定（プリセット非一致）→ シンプルなクリア画面
    showCustomClearScreen();
  }
}

// プリセットクリア画面
function showPresetClearScreen(presetName) {
  // 6AM表示後
  setTimeout(() => {
    // 黒背景に「CUSTOM NIGHT CLEAR」+ ★
    const screen = document.createElement('div');
    screen.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: #000; display: flex; flex-direction: column;
      align-items: center; justify-content: center; z-index: 9999;
      font-family: 'Courier New', monospace;
    `;
    screen.innerHTML = `
      <p style="font-size: 1.2rem; color: #e8e4dc; letter-spacing: 0.15em; margin-bottom: 16px;">
        CUSTOM NIGHT CLEAR
      </p>
      <p style="font-size: 2rem; color: #c90; margin-bottom: 24px;">★</p>
      <button id="cn-back-btn" style="
        background: none; border: 1px solid #555; color: #999;
        padding: 10px 30px; font-family: 'Courier New', monospace;
        font-size: 0.9rem; cursor: pointer;
      ">カスタムナイトに戻る</button>
    `;
    document.body.appendChild(screen);
    
    document.getElementById('cn-back-btn').addEventListener('click', () => {
      window.location.href = 'custom_night.html';
    });
  }, 3000);
}

// カスタム設定クリア画面（プリセット非一致時）
function showCustomClearScreen() {
  setTimeout(() => {
    const screen = document.createElement('div');
    screen.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: #000; display: flex; flex-direction: column;
      align-items: center; justify-content: center; z-index: 9999;
      font-family: 'Courier New', monospace;
    `;
    screen.innerHTML = `
      <p style="font-size: 1.2rem; color: #e8e4dc; letter-spacing: 0.15em; margin-bottom: 24px;">
        CUSTOM NIGHT CLEAR
      </p>
      <button id="cn-back-btn" style="
        background: none; border: 1px solid #555; color: #999;
        padding: 10px 30px; font-family: 'Courier New', monospace;
        font-size: 0.9rem; cursor: pointer;
      ">カスタムナイトに戻る</button>
    `;
    document.body.appendChild(screen);
    
    document.getElementById('cn-back-btn').addEventListener('click', () => {
      window.location.href = 'custom_night.html';
    });
  }, 3000);
}
```

### 手順7：ゲームオーバー時の処理

```javascript
function onCustomNightGameOver() {
  // ジャンプスケア（攻撃してきたキャラのジャンプスケア画像を表示）
  showJumpscare(attackingCharacter);
  
  // 2秒後にカスタムナイト選択画面に戻る
  setTimeout(() => {
    window.location.href = 'custom_night.html';
  }, 2000);
}
```

### 手順8：UIの微調整

カスタムナイトゲーム画面に以下を追加：
- 画面左上に「CUSTOM NIGHT」表示（小さく）
- 各キャラのAIレベルを小さく表示（デバッグ用にもなる）

```html
<div class="cn-game-header" style="
  position: fixed; top: 8px; left: 12px; z-index: 100;
  font-family: 'Courier New', monospace; font-size: 0.65rem;
  color: #555; letter-spacing: 0.05em;
">
  CUSTOM NIGHT
</div>
```

## 「予定通り」特別演出との接続

「予定通り」クリア時の特別演出（ジャンプスケア・砂嵐・ティーザー等）は
CLAUDE_CODE_ENDING_RESTRUCTURE.md に定義済み。

custom_night_game.js 内で `yoteidooriClearEnding()` を呼び出す。
この関数は以下のいずれかの方法で実装：
- 同じJSファイル内に定義
- 別ファイル（ending_restructure.js）としてインポート

## 重要な注意事項

- Night6のゲームロジック自体は変更しない。変えるのはパラメータの読み込み方だけ。
- Night6のファイルを直接編集しない。コピーしたファイルを編集する。
- AIレベル0のキャラは完全に無効化。中途半端に動いてはいけない。
- 試作きつねのレベルが0の場合、ノイズ演出も出現判定も一切なし。
- 「予定通り」（全員20）は本当に難しくする。テストプレイでクリア可能なことを確認。

## 確認チェックリスト

### 基本動作
- [ ] カスタムナイト選択画面からSTARTでゲームが始まるか
- [ ] 選択画面で設定したAIレベルが反映されているか
- [ ] AIレベル0のキャラが完全に無効化されているか
- [ ] AIレベル20のキャラが最大難度で動いているか

### 各キャラのレベル反映
- [ ] キツネ団長：レベルに応じて時計の減少速度が変わるか
- [ ] かあ博士：レベルに応じて移動間隔が変わるか
- [ ] うっきち：レベルに応じて移動間隔が変わるか＋反対側特性維持
- [ ] ぽたまる：レベルに応じてトリガー頻度が変わるか
- [ ] 試作きつね：レベルに応じて出現確率が変わるか＋シャッター無効維持

### プリセット
- [ ] 「放送開始」：キツネ10/かあ10/他0 で動作するか
- [ ] 「フェーズ2」：キツネ10/かあ10/うっきち10/他0 で動作するか
- [ ] 「全員集合」：全員10/試作0 で動作するか
- [ ] 「プロジェクトK」：全員15/試作0 で動作するか
- [ ] 「1997年10月」：全員15/試作15 で動作するか
- [ ] 「想定外の出力」：全員10/試作20 で動作するか
- [ ] 「予定通り」：全員20 で動作するか

### クリア時
- [ ] 通常プリセットクリア → ★獲得 → 選択画面に戻るか
- [ ] 「予定通り」クリア → 特別演出が発動するか
- [ ] カスタム設定（プリセット非一致）クリア → シンプルクリア画面か
- [ ] ★がカスタムナイト選択画面に正しく反映されるか

### ゲームオーバー時
- [ ] 攻撃してきたキャラのジャンプスケアが表示されるか
- [ ] カスタムナイト選択画面に戻るか

### 難易度バランス
- [ ] 全員0 → 何も起きない（6AMまで安全に待てる）
- [ ] 全員10 → Night4程度の難易度か
- [ ] 全員20 → Night6より明らかに難しいか
- [ ] 試作きつね20 → 頻繁に出現して忙しいか
