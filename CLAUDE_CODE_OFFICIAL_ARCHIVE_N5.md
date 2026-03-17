# CLAUDE_CODE_OFFICIAL_ARCHIVE_N5.md
# Night5後 公式アーカイブページ＋エンディング演出 制作指示書

## ⚠️ 重要：実際にファイルを作成・編集してください。レポートだけで完了にしないこと。

============================================================
## 概要
============================================================

Night5クリア後に11ページを追加し、メインエンディング演出を実装する。
Night5後はNight2〜4後とは性質が異なり、**ストーリー完結＋Night6への橋渡し**が目的。

フレーバーページは最小限。ほぼ全ページが仕込みまたはエンディング演出。

============================================================
## 共通仕様
============================================================

### CSS
- M, N, Oページ：`official-restored.css` を使用（Night2後以降と同じ復元デザイン）
- ただしM-0（封印ファイル一覧）は背景をさらに暗く（#d0ccc4程度）＋赤い枠線
- O-2（回復記録）：専用CSS。黒背景＋白文字のターミナル風
- P-1（NIGHT 5 COMPLETE）：専用CSS。完全黒背景。official-restored.cssを使わない

### 配置先
`official/night5/`
CSS参照：`<link href="../official-restored.css">`（M, N, Oページ）

### localStorage制御
- Night5後ページ：`night5_cleared === 'true'` のときのみアクセス可能
- 未クリア状態でURLに直接アクセスした場合はリダイレクト

### ナビゲーション
- ナビバーに新セクションを追加**しない**
- 導線は「おしらせ」欄のリンクのみ

### おしらせ欄への追加

Night5クリア後のおしらせエントリ（night5_cleared時に表示）：
```html
<div class="oshirase-entry" data-night="night5">
  <p class="oshirase-date">1997.10.██　封印ファイルが解放されました。</p>
  <ul class="oshirase-links">
    <li><a href="night5/sealed_list.html">封印ファイル</a></li>
    <li><a href="night5/finalep_script.html">最終回関連</a></li>
    <li><a href="night5/subject_list.html">被験者記録</a></li>
  </ul>
</div>
```

**注意：** Night5のおしらせだけ日付が「1997.10.██」と**年月が読める**。
Night2〜4の「────.──.──」と明確に異なる。10月＝打ち切りの月。日だけ欠損。

おしらせの並び順（上から新しい順）：
1. Night5後の封印ファイル通知（night5_cleared時）
2. Night4後の復元通知（night4_cleared時）
3. Night3後の復元通知（night3_cleared時）
4. Night2後の復元通知（night2_cleared時）
5. 既存のおしらせ（1997.09.20 等）

============================================================
## Night5後ページ一覧（11ページ）
============================================================

**配置先：`official/night5/`**

### M. 封印ファイル（5ページ）

| ID  | ファイル名 | ページ名 | 種別 |
|-----|-----------|---------|------|
| M-0 | sealed_list.html | 封印ファイル一覧 | 一覧 |
| M-1 | experiment_001.html | 実験記録 #001 | ★ロア核 |
| M-2 | experiment_002.html | 実験記録 #002 | ★ロア核 |
| M-3 | experiment_003.html | 実験記録 #003 | ★ロア核 |
| M-4 | handler_file.html | 担当者ファイル | ★ロア核 |

### N. 最終回関連（3ページ）

| ID  | ファイル名 | ページ名 | 種別 |
|-----|-----------|---------|------|
| N-1 | finalep_script.html | 最終回台本（封印版） | ★仕込み |
| N-2 | unaired_list.html | 未放送映像リスト | フレーバー |
| N-3 | suspension_report.html | 放送中断報告書 | ★仕込み |

### O. 被験者記録（2ページ）

| ID  | ファイル名 | ページ名 | 種別 |
|-----|-----------|---------|------|
| O-1 | subject_list.html | 被験者リスト | ★エンディング核 |
| O-2 | recovery.html | 回復記録 | ★エンディング演出 |

### P. メタページ（1ページ）

| ID  | ファイル名 | ページ名 | 種別 |
|-----|-----------|---------|------|
| P-1 | complete.html | NIGHT 5 COMPLETE | ★メタページ |

============================================================
## エンディング進行方式
============================================================

**フェーズ1〜3：手動探索**（プレイヤーが自分で読む）
**フェーズ4〜5：自動演出**（O-1最下部から自動的にO-2→P-1へ遷移）

### フェーズ1：解放（手動）

Night5クリア直後：
```
画面暗転

中央にテキスト（白文字・monospace）：
    ── アクセス制限が解除されました ──

3秒後フェードアウト

公式サイトトップ（official/index.html）に自動遷移
```

プレイヤーはおしらせ欄から封印ファイルに進む。

### フェーズ2：真実（手動）

プレイヤーがM-0 → M-1 → M-2 → M-3 → M-4 と読み進める。
N-1, N-2, N-3 も自由に閲覧可能。
順序は強制しない。

### フェーズ3：衝撃（手動→自動への切り替え点）

プレイヤーがO-1（被験者リスト）を開く。
リストをスクロールして最下部の「悠具志 業　状態：変化なし」を自分の目で見つける。

O-1の最下部に**「被験者状態更新を実行する」**ボタン（またはリンク）を配置。
クリックするとO-2（回復記録）に遷移し、ここから自動演出開始。

### フェーズ4：希望と絶望（自動演出）

→ 詳細は後述「O-2 回復記録 演出仕様」

### フェーズ5：メタ完結（自動演出）

→ 詳細は後述「P-1 NIGHT 5 COMPLETE 演出仕様」

============================================================
## 仕込みページ サンプルテキスト
============================================================

### M-0 封印ファイル一覧

```html
<!-- 背景をさらに暗く、赤枠で警告 -->
<div class="sealed-warning">
  ⚠ 封印ファイル
</div>

<p class="sealed-notice">
以下のファイルは長期間アクセスが制限されていました。<br>
データの一部に破損・欠落がある可能性があります。
</p>

<ul class="sealed-file-list">
  <li><a href="experiment_001.html">実験記録 #001</a></li>
  <li><a href="experiment_002.html">実験記録 #002</a></li>
  <li><a href="experiment_003.html">実験記録 #003</a></li>
  <li><a href="handler_file.html">担当者ファイル</a></li>
</ul>

<hr>

<ul class="sealed-file-list">
  <li><a href="finalep_script.html">最終回台本（封印版）</a></li>
  <li><a href="unaired_list.html">未放送映像リスト</a></li>
  <li><a href="suspension_report.html">放送中断報告書</a></li>
</ul>

<hr>

<ul class="sealed-file-list">
  <li><a href="subject_list.html">被験者記録</a> <span class="warning-text">※閲覧注意</span></li>
</ul>
```

CSS追加（official-restored.cssまたはページ内style）：
```css
.sealed-warning {
  border: 2px solid #a33;
  color: #a33;
  text-align: center;
  padding: 12px;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.sealed-notice {
  color: #666;
  font-size: 0.9rem;
}

.warning-text {
  color: #a33;
  font-size: 0.85rem;
}
```

M-0の背景色は `#d0ccc4` に変更（他の復元ページより暗い）。
スキャンラインのopacityをやや上げる（0.03→0.05程度）。

### M-1 実験記録 #001

```
実験記録 #001
機密区分：████

概要：
本プロジェクトは、映像・音声パターンが子どもの情動反応に
与える影響を体系的に研究することを目的とする。

方法：
番組「木漏れ日遊園地」の放送を通じ、特定の映像パターンおよび
音声パターンを視聴者に継続的に提示する。
視聴者の情動反応は、番組への反応データ（視聴維持率・投書内容・
イベント参加時の行動観察）を通じて間接的に収集する。

対象：
レベル1：一般視聴者（推定██万人）
  → 放送波を通じた間接的なパターン提示
レベル2：収録参加者（██名）
  → スタジオ環境での直接的なパターン提示
  → 個別の反応測定を実施
レベル3：████（██名）
  → ████████████████████████

実施期間：
1991年4月〜████年██月

備考：
制作スタッフの大半は本プロジェクトの存在を認識していない。
番組制作は通常の教育番組として進行させること。
```

### M-2 実験記録 #002

```
実験記録 #002
機密区分：████

件名：試作機に関する記録

1990年頃、キツネ団長の試作機（以下「試作体」）が完成。
テスト収録を実施したところ、想定外の出力が確認された。

想定外の出力の内容：
████████████████████████████████████████
████████████████████████████████████████
████████████████████████████████████████

テスト収録に立ち会ったスタッフ██名のうち、
██名が████████████を報告。

対応：
試作体は廃棄処分とし、正式版（キツネ団長）を新規製造する。

ただし、████████████の判断により、
試作体は████に保管することとなった。
廃棄記録のみ残し、保管の事実は記録しない。

正式版の設計にあたっては、試作体で確認された
████████████を████████████する調整を行った。
```

### M-3 実験記録 #003

```
実験記録 #003
機密区分：████

件名：1997年秋 放送事故報告

1997年██月██日の放送において、
試作体のデータが放送波に混入した。

経緯：
████████████████████████████████████████
████████████████████████████████████████

混入時間：約██秒間

影響：
放送エリア内の視聴者████████████████████。
特にレベル2対象者のうち██名に████████████が確認された。

記録上の分類：機材トラブルによる放送事故
実態：████████████████████████████████████

対応：
・番組の即時終了
・関連資料の████████████
・スタッフへの説明は「諸般の事情」で統一
・████████████は████████████

本件が偶発的な事故であるか、
人為的なものであるかは████████████████。
```

### M-4 担当者ファイル

```
担当者記録

対象：S-012（悠具志 業）
担当：████████████

選定理由：████████████████████████████████
実施内容：████████████████████████████████
期間：1993年██月〜1994年██月

経過：
████████████████████████████████████
████████████████████████████████████
他の被験者と比較して、顕著な████████████が確認された。
████████████████████████████████████

████年、対象は独自に番組に関する調査を開始。
████████████████████████████████████
████████████████████████████████████
試作体のデータに接触したことで、意識が████████████。

現在の状態：植物状態

最終報告：
████████████████████████████████████
「対象は今後も████████████████████」
████████████████████████████████████
```

### N-1 最終回台本（封印版）

```
木漏れ日遊園地 第███回
「みんな ありがとう ～おわかれのひ～」

※本エピソードは放送されませんでした

─────────────────

シーン1：メインステージ

キツネ団長「みんな、きょうは とくべつな おしらせが あるんだ」

ぽたまる「とくべつ？ なになに？」

キツネ団長「じつはね…この ゆうえんち、きょうで おしまいなんだ」

かあ博士「…そうなのです」

うっきち「ええっ！ やだよ！ やだやだ！」

─────────────────

シーン2：各キャラの別れの言葉

████████████████████████████████████
████████████████████████████████████
████████████████████████████████████

─────────────────

シーン3：エンディング

████████████████████████████████████

（注記：本シーンの内容は████████████の判断により
 記録から削除されています）
```

### N-3 放送中断報告書

K-5（番組終了通達）の完全版。黒塗りなし：

```
放送中断報告書

                              1997年10月15日

件名：番組「木漏れ日遊園地」放送中断について

1997年██月██日の放送において技術的問題が発生し、
番組の継続が困難な状況となりました。

原因：
放送システムの████████████により、
未承認のデータが放送波に混入。

対応措置：
1. 番組の即時終了
2. 収録済み素材の全量回収および施錠保管
3. スタジオセットの解体・撤去
4. 関連資料の機密指定

外部への説明：
「諸般の事情により放送を終了」で統一。
詳細な説明は一切行わない。

スタッフへの対応：
制作スタッフには「制作会社の経営問題」と説明。
████████████████████████████████████

                    ████████████
```

### O-1 被験者リスト

テーブル構造。全50名。管理番号・状態が並ぶ。

```html
<h2>被験者管理記録</h2>

<table class="subject-table">
  <thead>
    <tr>
      <th>No.</th>
      <th>管理番号</th>
      <th>状態</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>001</td><td>K-009</td><td class="redacted">████</td></tr>
    <tr><td>002</td><td>K-018</td><td class="redacted">████</td></tr>
    <tr><td>003</td><td>K-019</td><td class="redacted">████</td></tr>
    <tr><td>004</td><td>K-024</td><td class="redacted">████</td></tr>
    <tr><td>005</td><td>K-032</td><td class="redacted">████</td></tr>
    <tr><td>006</td><td>K-041</td><td class="redacted">████</td></tr>
    <tr><td>007</td><td>K-047</td><td class="redacted">████</td></tr>
    <!-- ... K番号の被験者が続く（全40名程度）... -->
    <!-- 名簿の欠番（K-009,018,019,024,032）が上位に来ることに注目 -->
    <tr><td>041</td><td>K-███</td><td class="redacted">████</td></tr>
    <!-- ... -->
    <tr><td>048</td><td>S-003</td><td class="redacted">████</td></tr>
    <tr><td>049</td><td>S-007</td><td class="redacted">████</td></tr>
    <tr class="subject-final"><td>050</td><td>S-012</td><td>悠具志 業</td></tr>
  </tbody>
</table>

<p class="subject-meta">
最終更新：████.██.██<br>
記録管理：██████████
</p>

<!-- フェーズ3→4への切り替えボタン -->
<div class="recovery-trigger">
  <button id="recovery-btn">被験者状態更新を実行する</button>
</div>
```

CSS：
```css
.subject-final td {
  background-color: rgba(150, 30, 30, 0.1);
}

.recovery-trigger {
  text-align: center;
  margin-top: 40px;
}

#recovery-btn {
  background: #333;
  color: #ccc;
  border: 1px solid #666;
  padding: 10px 24px;
  font-family: monospace;
  font-size: 0.95rem;
  cursor: pointer;
}

#recovery-btn:hover {
  background: #444;
  color: #fff;
}
```

設計ノート：
- K-009, K-018, K-019, K-024, K-032（Night3後名簿の欠番）が被験者リスト上位に登場
- 全員の「状態」欄が黒塗り（この時点ではまだ見えない）
- 050だけ名前が表示：「悠具志 業」
- 050の行だけ背景色がわずかに赤みがかっている
- S番号（Special）は048〜050の3名のみ
- 「被験者状態更新を実行する」ボタンをクリック→O-2に遷移、自動演出開始

============================================================
## O-2 回復記録 演出仕様（フェーズ4）
============================================================

O-2は通常のページではなく、**全画面の自動演出ページ**。
official-restored.cssは使わない。専用CSSで黒背景ターミナル風。

### CSS

```css
body {
  margin: 0;
  padding: 0;
  background: #000;
  color: #ddd;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  overflow: hidden;
}

.terminal {
  padding: 40px;
  max-width: 700px;
  margin: 0 auto;
}

.terminal-line {
  opacity: 0;
  transition: opacity 0.2s;
  margin: 2px 0;
}

.terminal-line.visible {
  opacity: 1;
}

.terminal-line.status-ok {
  color: #aaa;
}

.terminal-line.status-fail {
  color: #c44;
  font-weight: bold;
}

.terminal-line.system-msg {
  color: #888;
  margin-top: 12px;
  margin-bottom: 12px;
}
```

### HTML構造

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>回復記録</title>
  <!-- 専用CSS（上記） -->
</head>
<body>
  <div class="terminal" id="terminal">
    <!-- JSで動的に追加 -->
  </div>
  <script src="recovery_sequence.js"></script>
</body>
</html>
```

### JS演出シーケンス（recovery_sequence.js）

```javascript
const terminal = document.getElementById('terminal');

// 被験者データ（全50名）
// K番号40名 + S番号3名（S-003, S-007, S-012）= 最低43名
// 残りはK番号で埋める。合計50名。
const subjects = [
  { no: '001', id: 'K-009' },
  { no: '002', id: 'K-018' },
  { no: '003', id: 'K-019' },
  { no: '004', id: 'K-024' },
  { no: '005', id: 'K-032' },
  { no: '006', id: 'K-041' },
  { no: '007', id: 'K-047' },
  // ... K番号が続く（008〜047）...
  { no: '048', id: 'S-003' },
  { no: '049', id: 'S-007' },
  { no: '050', id: 'S-012', name: '悠具志 業', fail: true }
];

function addLine(text, className, callback) {
  const line = document.createElement('div');
  line.className = 'terminal-line ' + (className || '');
  line.textContent = text;
  terminal.appendChild(line);
  // 少し待ってからフェードイン
  requestAnimationFrame(() => {
    line.classList.add('visible');
  });
  // スクロールを最下部に
  terminal.scrollTop = terminal.scrollHeight;
  if (callback) callback();
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSequence() {
  // 開始メッセージ
  addLine('実験パターン解除プロセス...完了', 'system-msg');
  await sleep(2000);
  addLine('被験者状態を更新しています...', 'system-msg');
  await sleep(2000);
  addLine('', '');
  await sleep(500);

  // 段階A：加速する希望
  // 最初の3人はゆっくり（1500ms, 1200ms, 1000ms）
  // 4〜10人は中速（800ms→500ms）
  // 11〜30人は速め（300ms）
  // 31〜49人は高速（100ms）

  for (let i = 0; i < subjects.length; i++) {
    const s = subjects[i];

    if (s.fail) {
      // 050（業くん）：段階B
      addLine(s.no + ' | ' + s.id + ' ...', 'status-ok');
      await sleep(3000);  // 3秒沈黙（カーソルが止まる）
      
      // さらに3秒待つ
      await sleep(3000);

      // 最後の行を削除して、失敗表示に差し替え
      terminal.lastChild.remove();
      addLine(s.no + ' | ' + s.id + ' ... ' + s.name + '　──　変化なし', 'status-fail');
      
    } else {
      // 通常の被験者：正常化
      let delay;
      if (i < 3) delay = 1500 - (i * 150);        // 最初の3人：ゆっくり
      else if (i < 10) delay = 800 - (i * 30);     // 4〜10人：中速
      else if (i < 30) delay = 300;                 // 11〜30人：速め
      else delay = 100;                             // 31〜49人：高速

      addLine(s.no + ' | ' + s.id + ' ... 正常化', 'status-ok');
      await sleep(Math.max(delay, 80));
    }
  }

  // 段階C：静寂からフェーズ5へ
  await sleep(5000);  // 5秒の完全な静寂

  // 画面フェードアウト（3秒）
  document.body.style.transition = 'opacity 3s';
  document.body.style.opacity = '0';
  await sleep(3500);

  // P-1（NIGHT 5 COMPLETE）に遷移
  window.location.href = 'complete.html';
}

// ページ読み込み後に開始
window.addEventListener('load', function() {
  setTimeout(runSequence, 1000);
});
```

### 演出タイミング詳細

| 段階 | 内容 | 秒数 | 感情 |
|------|------|------|------|
| A前半 | 開始メッセージ＋最初3人（ゆっくり） | 約7秒 | 緊張 |
| A後半 | 加速して残り46人が流れる | 約8秒 | 高揚・希望 |
| B前半 | 050で停止。沈黙 | 約6秒 | 不安 |
| B後半 | 「悠具志 業 ── 変化なし」赤文字表示 | 瞬間 | 衝撃 |
| C | 静寂5秒→フェードアウト3秒 | 約8秒 | 余韻 |
| 合計 | | 約29秒 + 開始4.5秒 | |

============================================================
## P-1 NIGHT 5 COMPLETE 演出仕様（フェーズ5）
============================================================

### CSS（専用・official-restored.cssは使わない）

```css
body {
  margin: 0;
  padding: 0;
  background: #000;
  color: #fff;
  font-family: 'Courier New', monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
}

.complete-container {
  text-align: center;
}

.complete-title {
  font-size: 1.6rem;
  letter-spacing: 0.15em;
  opacity: 0;
  transition: opacity 2s;
}

.complete-msg {
  font-size: 1rem;
  margin-top: 30px;
  opacity: 0;
  transition: opacity 2s;
  color: #aaa;
}

.complete-counter {
  font-size: 1.2rem;
  margin-top: 50px;
  opacity: 0;
  transition: opacity 1.5s;
  color: #666;
}

/* ノイズ */
@keyframes noise {
  0% { filter: none; }
  10% { filter: brightness(1.5) contrast(2) hue-rotate(90deg); }
  20% { filter: invert(0.8); }
  30% { filter: brightness(0.5) hue-rotate(180deg); }
  40% { filter: none; }
  100% { filter: none; }
}

.glitch-active {
  animation: noise 0.4s linear;
}
```

### JS演出

```javascript
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function completeSequence() {
  const title = document.querySelector('.complete-title');
  const msg = document.querySelector('.complete-msg');
  const counter = document.querySelector('.complete-counter');

  // NIGHT 5 COMPLETE フェードイン
  await sleep(1500);
  title.style.opacity = '1';

  // おめでとうございます。フェードイン
  await sleep(3000);
  msg.style.opacity = '1';

  // 10秒の静寂
  await sleep(10000);

  // ノイズ（0.3〜0.5秒）
  document.body.classList.add('glitch-active');
  await sleep(400);
  document.body.classList.remove('glitch-active');

  // ノイズ後に 5/6 をフェードイン
  await sleep(1000);
  counter.style.opacity = '1';

  // 3秒後にファンサイトTOPに自動遷移
  await sleep(3000);
  window.location.href = '../../index.html'; // ファンサイトTOPのパス（要調整）
}

window.addEventListener('load', function() {
  // night5_clearedをセット（まだの場合）
  localStorage.setItem('night5_cleared', 'true');
  setTimeout(completeSequence, 500);
});
```

### HTML

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title></title>
  <!-- 専用CSS -->
</head>
<body>
  <div class="complete-container">
    <div class="complete-title">NIGHT 5 COMPLETE</div>
    <div class="complete-msg">おめでとうございます。</div>
    <div class="complete-counter">5 / 6</div>
  </div>
  <script src="complete_sequence.js"></script>
</body>
</html>
```

**注意：** `<title>` は空にする。タブに何も表示しない。

============================================================
## Night5入口（お問い合わせフォーム）の修正
============================================================

Night1から存在するお問い合わせフォーム（night1/contact.html）に判定ロジックを追加する。

### フォーム構成

```html
<form id="contact-form" onsubmit="return false;">
  <div class="form-group">
    <label>お名前</label>
    <input type="text" id="contact-name" placeholder="お名前">
  </div>
  <div class="form-group">
    <label>メールアドレス</label>
    <input type="email" id="contact-email" placeholder="メールアドレス">
  </div>
  <div class="form-group">
    <label>お問い合わせ種別</label>
    <select id="contact-type">
      <option value="">選択してください</option>
      <option value="番組について">番組について</option>
      <option value="収録参加について">収録参加について</option>
      <option value="その他">その他</option>
    </select>
  </div>
  <div class="form-group">
    <label>お問い合わせ内容</label>
    <textarea id="contact-content" rows="5" placeholder="お問い合わせ内容"></textarea>
  </div>
  <button type="button" id="contact-submit">送信</button>
</form>

<div id="contact-error" style="display:none; color:#a33; margin-top:12px;">
  送信できませんでした。内容をご確認ください。
</div>
```

### JS判定

```javascript
document.getElementById('contact-submit').addEventListener('click', function() {
  const email = document.getElementById('contact-email').value.trim();
  const type = document.getElementById('contact-type').value;
  const content = document.getElementById('contact-content').value.trim();
  
  // Night5入口判定（Night4クリア後のみ）
  if (
    email === 'k-project@yume-studio.co.jp' &&
    type === '収録参加について' &&
    content === '1986年の初期構想について' &&
    localStorage.getItem('night4_cleared') === 'true'
  ) {
    triggerNight5Entrance();
    return;
  }
  
  // 不正解：エラー表示
  document.getElementById('contact-error').style.display = 'block';
});

function triggerNight5Entrance() {
  // 画面フリーズ
  document.body.style.pointerEvents = 'none';
  
  // ノイズエフェクト
  document.body.classList.add('glitch-effect');
  
  setTimeout(function() {
    document.body.classList.remove('glitch-effect');
    
    // オーバーレイ表示
    const overlay = document.createElement('div');
    overlay.className = 'night-entrance-overlay';
    overlay.innerHTML = '<p>── アクセスを許可します ──</p>';
    document.body.appendChild(overlay);
    
    // Night5へ遷移
    setTimeout(function() {
      window.location.href = '（Night5ゲームのパス）';
    }, 2500);
  }, 1500);
}
```

### Night4後ページへの追記（フォームへの導線ヒント）

**K-5（番組終了通達・night4/memo_05.html）に追記：**
既存テキストの「本件に関するお問い合わせは████████████まで」を以下に修正：
```
本件に関するお問い合わせは
k-████@████████████ までお願いいたします。
```

**L-2（対象者選定基準・night4/project_02.html）に追記：**
既存テキストの末尾の黒塗りブロック内に以下を追加：
```
████████████████████████████████████

上記に関する問い合わせの際は
担当：吉田 宛
件名を「初期構想について」としてください。

████████████████████████████████████
```

============================================================
## フレーバーページのテーマ
============================================================

| ID  | テーマ・切り口 |
|-----|--------------|
| N-2 | 未放送映像のタイトル一覧と収録日。内容は「データ破損のため再生不可」。タイトルだけで不穏さを漂わせる（例：「テスト収録 #00」「████████」「特別版（未承認）」等） |

============================================================
## 実装チェックリスト
============================================================

### Night5後ページ（11ページ）
- [ ] M-0（封印ファイル一覧）：赤枠警告＋暗い背景＋スキャンライン強め
- [ ] M-1（実験記録#001）：実験の全貌。ほぼ平文
- [ ] M-2（実験記録#002）：試作きつね。「想定外の出力」詳細
- [ ] M-3（実験記録#003）：1997年データ混入事故
- [ ] M-4（担当者ファイル）：業くん（S-012）の記録。担当者名は黒塗り
- [ ] N-1（最終回台本）：未放送の最終回。シーン1のみ読めてシーン2-3は黒塗り
- [ ] N-2（未放送映像リスト）：タイトル＋日付のみ
- [ ] N-3（放送中断報告書）：K-5の完全版。黒塗りなし（一部除く）
- [ ] O-1（被験者リスト）：全50名。K番号＋S番号。業くんだけ名前表示
- [ ] O-1：K-009,018,019,024,032がリスト上位に含まれること
- [ ] O-1：「被験者状態更新を実行する」ボタン
- [ ] O-2（回復記録）：全画面自動演出。黒背景ターミナル風
- [ ] O-2：段階A（加速する正常化）→段階B（050で停止→変化なし赤文字）→段階C（静寂→フェード）
- [ ] P-1（NIGHT 5 COMPLETE）：黒背景メタページ
- [ ] P-1：タイトル→おめでとうございます→10秒静寂→ノイズ→5/6→ファンサイトTOP遷移

### お問い合わせフォーム修正
- [ ] contact.htmlにプルダウン3択（番組について/収録参加について/その他）追加
- [ ] JS判定ロジック追加（メール＋種別＋内容の3欄判定）
- [ ] お名前欄は判定しない
- [ ] night4_clearedチェック

### Night4後ページ追記
- [ ] K-5に `k-████@████████████` の記述追加
- [ ] L-2に「担当：吉田 宛」「件名を『初期構想について』としてください」追加

### 共通
- [ ] 全ページが official/night5/ に配置
- [ ] localStorage night5_cleared 判定
- [ ] おしらせ欄にNight5後通知追加（日付 1997.10.██）
- [ ] ナビバーに新セクション追加しない
- [ ] スタッフ名統一（ぽたまる＝リボン）
- [ ] 全ページプッシュ完了
