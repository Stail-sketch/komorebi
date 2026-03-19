# CLAUDE_CODE_ENDING_RESTRUCTURE.md
# エンディング構造改修 指示書

## ⚠️ 重要：真エンディングとALL CLEARを完全に分離する大きな変更です。

## 変更の概要

**変更前：**
Night6クリア → 業くん演出 → 歓声 → 歓声歪み → ジャンプスケア → 砂嵐 → 「予定通りです」→ Night選択画面（ALL CLEAR）

**変更後：**
- Night6クリア → 業くん演出 → 歓声 → 「Night 6 クリア おめでとう！」→ カスタムナイト（ハッピーエンド）
- カスタムナイト「予定通り」クリア → ALL CLEAR → 歓声 → 歓声歪み → ジャンプスケア → 砂嵐 → 「予定通りです」→ ティーザー → カスタムナイト選択画面（恐怖エンド）

## Night6クリア演出（ハッピーエンド）

Night6の6AM到達後、以下の演出を順に実行：

```javascript
async function night6Ending() {
  // ゲーム停止
  stopAllGameActivity();
  
  // 6AM表示（3秒）
  await showSixAM();
  await sleep(3000);
  
  // 黒画面（2秒）
  fadeToBlack();
  await sleep(2000);
  
  // ===== ⑤ 業くん目覚め =====
  
  // Phase A：闘の中（10秒）
  await showText('...');
  await sleep(3000);
  await showText('...くらい');
  await sleep(3000);
  await showText('ずっと、くらい');
  await sleep(4000);
  clearText();
  
  // Phase B：光の兆し（10秒）
  await showText('...なにか、聞こえる');
  showLightPoint(); // 中央に白い光の点
  await sleep(5000);
  await showText('だれかの声が、する');
  expandLight(); // 光が拡大
  await sleep(5000);
  clearText();
  
  // Phase C：目覚め（20秒）
  expandLight(); // 光がさらに広がる
  await showText('...まぶしい');
  await sleep(5000);
  await showText('ここは——');
  await sleep(3000);
  // ホワイトアウト→病室天井画像（ブラー→解除）
  showHospitalCeiling(); // ブラー状態で表示
  await sleep(3000);
  removeCeilingBlur(); // 3秒かけてピント合う
  await sleep(6000);
  clearAll();
  
  // Phase D：確認（12秒）
  await sleep(3000);
  await showSystemText('被験者管理記録 更新');
  await sleep(3000);
  await showSystemText('S-012 | 悠具志 業');
  await sleep(3000);
  await showSystemText('状態：——意識回復', 'green'); // 緑文字
  await sleep(3000);
  
  // Phase E：移行（7秒）
  whiteOut(7000); // 7秒かけてホワイトアウト
  await sleep(7000);
  
  // ===== ⑥ 余韻 =====
  
  // clear_chime 再生
  const chime = new Audio('../assets/audio/clear_chime.mp3');
  chime.volume = 0.6;
  chime.play();
  await sleep(3000);
  
  // clear_yay 再生（歓声）
  const yay = new Audio('../assets/audio/clear_yay.mp3');
  yay.volume = 0.7;
  yay.play();
  await sleep(7000);
  
  // 歓声がフェードアウト（普通に。歪まない）
  fadeOutAudio(yay, 2000);
  await sleep(3000);
  
  // ===== Night 6 クリア おめでとう！ =====
  
  // ホワイトアウトから黒背景に
  fadeToBlack();
  await sleep(2000);
  
  // 「Night 6 クリア おめでとう！」表示
  const clearMsg = document.createElement('div');
  clearMsg.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: #000; display: flex; flex-direction: column;
    align-items: center; justify-content: center; z-index: 9999;
  `;
  clearMsg.innerHTML = `
    <p style="font-family: 'Courier New', monospace; font-size: 1.4rem;
       color: #e8e4dc; letter-spacing: 0.15em; margin-bottom: 20px;">
      NIGHT 6 COMPLETE
    </p>
    <p style="font-family: 'Courier New', monospace; font-size: 1rem;
       color: #aaa; letter-spacing: 0.1em;">
      おめでとう！
    </p>
  `;
  document.body.appendChild(clearMsg);
  
  await sleep(5000);
  
  // localStorageセット
  localStorage.setItem('night6_cleared', 'true');
  
  // カスタムナイト選択画面に遷移
  window.location.href = '（カスタムナイト選択画面のパス）';
}
```

**注意：**
- Night6は「おめでとう！」で終わる。「おめでとうございます。」でも「予定通りです。」でもない
- 歓声は普通にフェードアウトする（歪まない）
- ジャンプスケア・砂嵐・「予定通り」は一切なし
- 業くんが助かった→ハッピー→カスタムナイトへ、という明るい流れ

## カスタムナイト「予定通り」クリア演出（恐怖エンド）

「予定通り」プリセット（全員20）をクリアした時のみ発動する特別演出。
他のプリセットクリア時は通常の「6AM + ★獲得」で終わる。

```javascript
async function yoteidooriClearEnding() {
  // ゲーム停止
  stopAllGameActivity();
  
  // 6AM表示
  await showSixAM();
  await sleep(3000);
  fadeToBlack();
  await sleep(2000);
  
  // ===== ALL CLEAR表示 =====
  
  await showTypewriter('ALL CLEAR', 100); // タイプライター表示
  await sleep(1000);
  addGlow(); // 白い発光
  await sleep(2000);
  await showFadeIn('THANK YOU FOR PLAYING', 3000); // 3秒フェードイン
  await sleep(5000);
  
  // ===== 歓声 =====
  
  // ホワイトアウト
  whiteOut(3000);
  await sleep(3000);
  
  // clear_chime
  const chime = new Audio('../assets/audio/clear_chime.mp3');
  chime.volume = 0.6;
  chime.play();
  await sleep(3000);
  
  // clear_yay（歓声）
  const yay = new Audio('../assets/audio/clear_yay.mp3');
  yay.volume = 0.7;
  yay.playbackRate = 1.0;
  yay.play();
  await sleep(7000);
  
  // ===== ⑦ 歓声が歪んで消える（4秒） =====
  
  const distortStart = Date.now();
  const distortDuration = 3500;
  
  function distortAudio() {
    const elapsed = Date.now() - distortStart;
    const progress = Math.min(elapsed / distortDuration, 1);
    yay.playbackRate = 1.0 - (progress * 0.8);
    yay.volume = 0.7 * (1 - progress);
    if (progress < 1) {
      requestAnimationFrame(distortAudio);
    } else {
      yay.pause();
    }
  }
  distortAudio();
  await sleep(4000);
  
  // 白い画面＋沈黙（2秒）
  await sleep(2000);
  
  // ===== ⑧前半：ジャンプスケア（1秒） =====
  
  // 白→黒に瞬時切替
  document.body.style.backgroundColor = '#000';
  document.body.style.transition = 'none';
  
  // 獣人ジャンプスケア
  const jumpscare = document.createElement('img');
  jumpscare.src = '../assets/images/unknown_entity.png';
  jumpscare.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh;
    object-fit: cover; z-index: 10000;
  `;
  document.body.appendChild(jumpscare);
  
  const sfx = new Audio('../assets/audio/jumpscare_sfx.mp3');
  sfx.volume = 0.8;
  sfx.play();
  
  await sleep(1000);
  jumpscare.remove();
  
  // ===== ⑧後半：アナログTV砂嵐（1.5秒） =====
  
  const snowCanvas = document.createElement('canvas');
  snowCanvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%; z-index: 10000;
  `;
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight;
  document.body.appendChild(snowCanvas);
  
  const ctx = snowCanvas.getContext('2d');
  let snowActive = true;
  
  function drawSnow() {
    if (!snowActive) return;
    const w = snowCanvas.width;
    const h = snowCanvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v; data[i+1] = v; data[i+2] = v; data[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(drawSnow);
  }
  drawSnow();
  
  await sleep(1500);
  snowActive = false;
  snowCanvas.remove();
  
  // ===== ⑨「おめでとう。予定通りです。」（既に表示・5秒） =====
  
  const msgContainer = document.createElement('div');
  msgContainer.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: #000; display: flex; align-items: center;
    justify-content: center; z-index: 9999;
  `;
  msgContainer.innerHTML = `
    <p style="font-family: 'Courier New', monospace; font-size: 1.1rem;
       color: #888; letter-spacing: 0.1em;">
      おめでとう。予定通りです。
    </p>
  `;
  document.body.appendChild(msgContainer);
  
  await sleep(5000);
  
  // ===== ティーザー =====
  
  msgContainer.style.transition = 'opacity 2s';
  msgContainer.style.opacity = '0';
  await sleep(2500);
  msgContainer.remove();
  
  // ティーザー表示
  const teaser = document.createElement('div');
  teaser.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: #000; display: flex; flex-direction: column;
    align-items: center; justify-content: center; z-index: 9999;
    font-family: 'Courier New', monospace; color: #4a4;
  `;
  
  // PROCESS STILL RUNNING
  const log1 = document.createElement('p');
  log1.style.cssText = 'font-size: 0.85rem; opacity: 0; transition: opacity 2s; margin-bottom: 24px;';
  log1.textContent = 'LOG_2026.██.██_██:██:██';
  teaser.appendChild(log1);
  
  const log2 = document.createElement('p');
  log2.style.cssText = 'font-size: 1rem; opacity: 0; transition: opacity 2s; margin-bottom: 40px;';
  log2.textContent = 'PROCESS STILL RUNNING';
  teaser.appendChild(log2);
  
  // K-059
  const log3 = document.createElement('p');
  log3.style.cssText = 'font-size: 0.85rem; opacity: 0; transition: opacity 2s; margin-bottom: 8px;';
  log3.textContent = '被験者管理記録 更新';
  teaser.appendChild(log3);
  
  const log4 = document.createElement('p');
  log4.style.cssText = 'font-size: 0.9rem; opacity: 0; transition: opacity 2s;';
  log4.textContent = 'K-059 | ████.██.██ | ██';
  teaser.appendChild(log4);
  
  document.body.appendChild(teaser);
  
  await sleep(1000);
  log1.style.opacity = '1';
  await sleep(2000);
  log2.style.opacity = '1';
  await sleep(3000);
  log3.style.opacity = '1';
  await sleep(2000);
  log4.style.opacity = '1';
  await sleep(5000);
  
  // フェードアウト
  teaser.style.transition = 'opacity 3s';
  teaser.style.opacity = '0';
  await sleep(3500);
  teaser.remove();
  
  // localStorageセット
  localStorage.setItem('yoteidoori_cleared', 'true');
  
  // カスタムナイト選択画面に遷移（★全獲得状態）
  window.location.href = '（カスタムナイト選択画面のパス）';
}
```

## カスタムナイト選択画面の修正

### プリセット7種

| プリセット名 | キツネ | かあ | うっきち | ぽたまる | 試作 |
|---|---|---|---|---|---|
| 放送開始 | 10 | 10 | 0 | 0 | 0 |
| フェーズ2 | 10 | 10 | 10 | 0 | 0 |
| 全員集合 | 10 | 10 | 10 | 10 | 0 |
| プロジェクトK | 15 | 15 | 15 | 15 | 0 |
| 1997年10月 | 15 | 15 | 15 | 15 | 15 |
| 想定外の出力 | 10 | 10 | 10 | 10 | 20 |
| 予定通り | 20 | 20 | 20 | 20 | 20 |

### 星の獲得

- 各プリセットクリアで★1個（計7個）
- 「予定通り」クリアは特別な金色★
- 表示：★★★★★★☆ → ★★★★★★★（全獲得）

### 「予定通り」クリア後の特別表示

カスタムナイト選択画面に戻った時：
- ★が全部金色に
- 画面下部に小さく表示：

```
PROCESS STILL RUNNING
```

常時表示。不穏な余韻を残す。

### クリア判定

```javascript
// プリセットクリア時の処理
function onCustomNightClear(presetName) {
  localStorage.setItem('custom_' + presetName + '_cleared', 'true');
  
  if (presetName === 'yoteidoori') {
    // 「予定通り」は特別演出
    yoteidooriClearEnding();
  } else {
    // 通常プリセットは普通のクリア
    showSixAM();
    showPresetClearScreen(presetName);
    // ★獲得 → カスタムナイト選択画面に戻る
  }
}
```

## Xシェアボタン・「最初に戻る」

カスタムナイト選択画面（Night6クリア後に最初に表示される画面）に配置：

```html
<button onclick="shareOnX()">Share on X</button>
<button onclick="location.href='（noteのURL）'">最初に戻る</button>
```

```javascript
function shareOnX() {
  const text = encodeURIComponent('木漏れ日遊園地、全クリアしました。 #木漏れ日遊園地');
  const url = encodeURIComponent('（ゲームURL）');
  window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}
```

## 確認チェックリスト

### Night6クリア
- [ ] 6AM後すぐに業くん演出が始まるか（①②③④なし、直接⑤へ）
- [ ] Phase A〜Eが正しく再生されるか
- [ ] 「意識回復」が緑文字か
- [ ] clear_chime → clear_yay が再生されるか
- [ ] 歓声は普通にフェードアウトするか（歪まない）
- [ ] 「Night 6 クリア おめでとう！」が表示されるか（「おめでとうございます」ではない）
- [ ] カスタムナイト選択画面に遷移するか
- [ ] ジャンプスケア・砂嵐・「予定通りです」が一切ないこと

### カスタムナイト通常プリセット
- [ ] 6AM + ★獲得のシンプルなクリア画面か
- [ ] ★がカスタムナイト選択画面に反映されるか

### カスタムナイト「予定通り」クリア
- [ ] 6AM後にALL CLEAR演出が始まるか
- [ ] clear_chime → clear_yay が再生されるか
- [ ] 歓声が歪んで消えるか（playbackRate低下）
- [ ] ジャンプスケア（unknown_entity.png + jumpscare_sfx.mp3）が表示されるか
- [ ] 砂嵐（1.5秒）が表示されるか
- [ ] 砂嵐が消えた瞬間「おめでとう。予定通りです。」が既に表示されているか
- [ ] ティーザー（PROCESS STILL RUNNING + K-059）が表示されるか
- [ ] カスタムナイト選択画面に戻るか
- [ ] ★が全て金色になっているか
- [ ] 画面下部に「PROCESS STILL RUNNING」が常時表示されるか

### 共通
- [ ] Xシェアボタンが機能するか
- [ ] 「最初に戻る」がnoteに飛ぶか
- [ ] Night6クリアとカスタムナイトクリアの演出が完全に分離されているか
