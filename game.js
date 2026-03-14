// ===== 木漏れ日遊園地 Night1 =====

// --- カメラ名マッピング ---
const CAMERA_NAMES = {
  1: 'CAM1 - メインステージ',
  2: 'CAM2 - からくり時計セット',
  3: 'CAM3 - ダンスフロア',
  4: 'CAM4 - 研究室セット',
  5: 'CAM5 - 小道具倉庫',
  6: 'CAM6 - バックステージ',
  7: 'CAM7 - 左通路',
  8: 'CAM8 - 右通路',
};

// --- カメラごとのキャラ表示位置 ---
// bottom, left, height はCSS値（%）。left は中心基準で transform: translateX(-50%) 適用
const CAMERA_CHAR_POSITIONS = {
  1: { bottom: '8%',  left: '50%', height: '55%' },  // メインステージ: 中央ステージ上
  2: { bottom: '10%', left: '45%', height: '50%' },  // からくり時計セット: 時計の前
  3: { bottom: '5%',  left: '55%', height: '50%' },  // ダンスフロア: タイル上
  4: { bottom: '8%',  left: '50%', height: '55%' },  // 研究室: 中央通路
  5: { bottom: '8%',  left: '50%', height: '50%' },  // 小道具倉庫: 中央
  6: { bottom: '10%', left: '50%', height: '55%' },  // バックステージ: 中央通路
  7: { bottom: '20%', left: '48%', height: '35%' },  // 左通路: 奥（小さく遠景）
  8: { bottom: '15%', left: '50%', height: '35%' },  // 右通路: 奥（小さく遠景）
};

// --- 定数 ---
const GAME_DURATION = 300;           // 秒（リアル5分）
const POWER_BASE_DRAIN = 0.05;       // %/秒
const POWER_CAMERA_DRAIN = 0.05;     // %/秒
const POWER_SHUTTER_DRAIN = 0.15;    // %/秒（片方）
const CLOCK_DRAIN = 0.5;             // ゲージ/秒
const CLOCK_WIND_PER_CLICK = 3;      // 1クリックあたりの回復量
const CLOCK_WARNING_THRESHOLD = 30;  // チクタク警告開始

// かあ博士
const KAA_FIRST_MOVE_MIN = 60;   // 初回移動開始（秒）
const KAA_FIRST_MOVE_MAX = 90;
const KAA_MOVE_INTERVAL_MIN = 8; // 移動間隔（秒）
const KAA_MOVE_INTERVAL_MAX = 15;
const KAA_DOOR_WAIT_MIN = 5;     // 扉前待機（秒）
const KAA_DOOR_WAIT_MAX = 10;

// --- ゲーム状態 ---
let gameState = {};

function initGameState() {
  gameState = {
    night: 1,
    time: 0,
    power: 100,
    gameOver: false,
    cleared: false,
    running: false,

    camera: {
      active: false,
      current: 1,
    },

    shutters: {
      left: false,
      right: false,
    },

    clockGauge: 100,

    characters: {
      kitsune: {
        position: 'cam2',
      },
      kaa: {
        position: 'cam4',
        nextMoveTime: randomRange(KAA_FIRST_MOVE_MIN, KAA_FIRST_MOVE_MAX),
        atDoor: false,
        doorSide: null,
        doorArrivalTime: 0,
      },
    },
  };
}

// --- ユーティリティ ---
function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function $(id) {
  return document.getElementById(id);
}

// --- DOM要素キャッシュ ---
let dom = {};

function cacheDom() {
  dom = {
    nightLabel: $('night-label'),
    timeDisplay: $('time-display'),
    powerBar: $('power-bar'),
    powerPercent: $('power-percent'),
    officeView: $('office-view'),
    cameraView: $('camera-view'),
    cameraFeed: $('camera-feed'),
    cameraLabel: $('camera-label'),
    cameraBg: $('camera-bg'),
    cameraChar: $('camera-char'),
    cameraToggleBtn: $('camera-toggle-btn'),
    cameraCloseBtn: $('camera-close-btn'),
    camButtons: document.querySelectorAll('.cam-btn'),
    leftShutterBtn: $('left-shutter-btn'),
    rightShutterBtn: $('right-shutter-btn'),
    leftShutterOverlay: $('left-shutter-overlay'),
    rightShutterOverlay: $('right-shutter-overlay'),
    leftDoorChar: $('left-door-char'),
    rightDoorChar: $('right-door-char'),
    clockGaugeContainer: $('clock-gauge-container'),
    clockGaugeBar: $('clock-gauge-bar'),
    clockGaugePercent: $('clock-gauge-percent'),
    jumpscareScreen: $('jumpscare-screen'),
    jumpscareImg: $('jumpscare-img'),
    gameoverScreen: $('gameover-screen'),
    retryBtn: $('retry-btn'),
    clearScreen: $('clear-screen'),
    continueBtn: $('continue-btn'),
    blackoutOverlay: $('blackout-overlay'),
  };
}

// ===== Step 1: 画面構造とカメラ切替 =====

function openCamera() {
  if (gameState.gameOver || gameState.cleared) return;
  gameState.camera.active = true;
  dom.cameraView.classList.remove('hidden');
  updateCameraView();
}

function closeCamera() {
  gameState.camera.active = false;
  dom.cameraView.classList.add('hidden');
}

function switchCamera(camNum) {
  if (gameState.gameOver || gameState.cleared) return;
  gameState.camera.current = camNum;

  // ボタンのactive状態更新
  dom.camButtons.forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.cam) === camNum);
  });

  updateCameraView();
}

function updateCameraView() {
  const cam = gameState.camera.current;

  // カメラ名
  dom.cameraLabel.textContent = CAMERA_NAMES[cam] || `CAM${cam}`;

  // 背景画像
  dom.cameraBg.src = `image/camera/cam${cam}.png`;

  // キャラ表示
  updateCameraCharacter();

  // 時計ゲージ（CAM2のみ）
  dom.clockGaugeContainer.classList.toggle('hidden', cam !== 2);
}

function updateCameraCharacter() {
  const cam = gameState.camera.current;
  const camKey = `cam${cam}`;

  let charImg = null;

  // キツネ団長
  if (gameState.characters.kitsune.position === camKey) {
    charImg = 'image/charas/kitsune_normal.png';
  }
  // かあ博士
  if (gameState.characters.kaa.position === camKey) {
    charImg = 'image/charas/kaa_normal.png';
  }

  if (charImg) {
    dom.cameraChar.src = charImg;
    dom.cameraChar.classList.remove('hidden');

    // カメラごとの位置設定を適用
    const pos = CAMERA_CHAR_POSITIONS[cam];
    if (pos) {
      dom.cameraChar.style.bottom = pos.bottom;
      dom.cameraChar.style.left = pos.left;
      dom.cameraChar.style.height = pos.height;
      dom.cameraChar.style.transform = 'translateX(-50%)';
    }
  } else {
    dom.cameraChar.classList.add('hidden');
  }
}

// シャッター開閉
function toggleShutter(side) {
  if (gameState.gameOver || gameState.cleared) return;

  const isLeft = side === 'left';
  gameState.shutters[side] = !gameState.shutters[side];
  const closed = gameState.shutters[side];

  const btn = isLeft ? dom.leftShutterBtn : dom.rightShutterBtn;
  const overlay = isLeft ? dom.leftShutterOverlay : dom.rightShutterOverlay;

  btn.classList.toggle('closed', closed);
  btn.querySelector('.shutter-state').textContent = closed ? '閉' : '開';
  overlay.classList.toggle('closed', closed);

  // シャッターを閉じた時、扉前にかあ博士がいれば即撃退
  if (closed) {
    const kaa = gameState.characters.kaa;
    if (kaa.atDoor && kaa.doorSide === side) {
      kaa.position = 'cam4';
      kaa.atDoor = false;
      kaa.doorSide = null;
      kaa.nextMoveTime = gameState.time + randomRange(KAA_MOVE_INTERVAL_MIN, KAA_MOVE_INTERVAL_MAX);
    }
  }

  updateDoorSilhouettes();
}

// ===== Step 2: ゲームタイマーと電力 =====

function updateTime(dt) {
  gameState.time += dt;

  // 時刻表示更新
  const hours = Math.floor(gameState.time / 50); // 50秒 = 1時間
  const displayHour = hours === 0 ? 12 : hours;
  const ampm = hours < 6 ? 'AM' : 'AM';
  dom.timeDisplay.textContent = `${displayHour}:00 AM`;

  // 6AM到達
  if (gameState.time >= GAME_DURATION) {
    gameClear();
  }
}

function updatePower(dt) {
  let drain = POWER_BASE_DRAIN;

  if (gameState.camera.active) {
    drain += POWER_CAMERA_DRAIN;
  }
  if (gameState.shutters.left) {
    drain += POWER_SHUTTER_DRAIN;
  }
  if (gameState.shutters.right) {
    drain += POWER_SHUTTER_DRAIN;
  }

  gameState.power -= drain * dt;
  if (gameState.power < 0) gameState.power = 0;

  // 表示更新
  const pct = Math.ceil(gameState.power);
  dom.powerBar.style.width = pct + '%';
  dom.powerPercent.textContent = pct + '%';

  // 色変化
  dom.powerBar.classList.remove('warning', 'danger');
  if (pct <= 15) {
    dom.powerBar.classList.add('danger');
  } else if (pct <= 30) {
    dom.powerBar.classList.add('warning');
  }

  // 電力0
  if (gameState.power <= 0) {
    powerOutage();
  }
}

function powerOutage() {
  // 全システム停止 → 暗転 → ゲームオーバー
  closeCamera();
  gameState.shutters.left = false;
  gameState.shutters.right = false;
  dom.leftShutterBtn.classList.remove('closed');
  dom.rightShutterBtn.classList.remove('closed');
  dom.leftShutterBtn.querySelector('.shutter-state').textContent = '開';
  dom.rightShutterBtn.querySelector('.shutter-state').textContent = '開';
  dom.leftShutterOverlay.classList.remove('closed');
  dom.rightShutterOverlay.classList.remove('closed');

  dom.blackoutOverlay.classList.remove('hidden');

  // 少し待ってからゲームオーバー
  setTimeout(() => {
    triggerGameOver('kitsune');
  }, 2000);
}

// ===== Step 3: キツネ団長（時計ギミック） =====

function updateClockGauge(dt) {
  gameState.clockGauge -= CLOCK_DRAIN * dt;
  if (gameState.clockGauge < 0) gameState.clockGauge = 0;

  // ゲージ表示更新
  const pct = Math.ceil(gameState.clockGauge);
  dom.clockGaugeBar.style.width = pct + '%';
  dom.clockGaugePercent.textContent = pct + '%';

  // 色変化
  dom.clockGaugeBar.classList.remove('warning', 'danger');
  if (pct <= 15) {
    dom.clockGaugeBar.classList.add('danger');
  } else if (pct <= CLOCK_WARNING_THRESHOLD) {
    dom.clockGaugeBar.classList.add('warning');
  }

  // ゲージ0 → 即死
  if (gameState.clockGauge <= 0) {
    triggerGameOver('kitsune');
  }
}

function windClock() {
  if (!gameState.camera.active || gameState.camera.current !== 2) return;
  if (gameState.gameOver || gameState.cleared) return;

  gameState.clockGauge = Math.min(100, gameState.clockGauge + CLOCK_WIND_PER_CLICK);
}

// ===== Step 4: かあ博士（ランダム移動） =====

const KAA_MOVE_PATH_AFTER_CAM6 = ['cam7', 'cam8'];

function updateKaa(dt) {
  const kaa = gameState.characters.kaa;

  if (kaa.atDoor) {
    // 扉前待機中
    const waitTime = gameState.time - kaa.doorArrivalTime;
    const maxWait = randomRange(KAA_DOOR_WAIT_MIN, KAA_DOOR_WAIT_MAX);

    if (waitTime >= maxWait) {
      // 判定
      const shutterClosed = kaa.doorSide === 'left'
        ? gameState.shutters.left
        : gameState.shutters.right;

      if (shutterClosed) {
        // 撃退 → CAM4に戻る
        kaa.position = 'cam4';
        kaa.atDoor = false;
        kaa.doorSide = null;
        kaa.nextMoveTime = gameState.time + randomRange(KAA_MOVE_INTERVAL_MIN, KAA_MOVE_INTERVAL_MAX);
        updateDoorSilhouettes();
        if (gameState.camera.active) updateCameraCharacter();
      } else {
        // 侵入 → ゲームオーバー
        triggerGameOver('kaa');
      }
    }
    return;
  }

  // 移動タイミングチェック
  if (gameState.time < kaa.nextMoveTime) return;

  // 現在位置に応じて次の位置へ
  switch (kaa.position) {
    case 'cam4':
      kaa.position = 'cam6';
      kaa.nextMoveTime = gameState.time + randomRange(KAA_MOVE_INTERVAL_MIN, KAA_MOVE_INTERVAL_MAX);
      break;

    case 'cam6':
      // ランダムで左右
      kaa.position = Math.random() < 0.5 ? 'cam7' : 'cam8';
      kaa.nextMoveTime = gameState.time + randomRange(KAA_MOVE_INTERVAL_MIN, KAA_MOVE_INTERVAL_MAX);
      break;

    case 'cam7':
      // 左扉前へ
      kaa.position = 'door_left';
      kaa.atDoor = true;
      kaa.doorSide = 'left';
      kaa.doorArrivalTime = gameState.time;
      updateDoorSilhouettes();
      break;

    case 'cam8':
      // 右扉前へ
      kaa.position = 'door_right';
      kaa.atDoor = true;
      kaa.doorSide = 'right';
      kaa.doorArrivalTime = gameState.time;
      updateDoorSilhouettes();
      break;
  }

  if (gameState.camera.active) updateCameraCharacter();
}

function updateDoorSilhouettes() {
  const kaa = gameState.characters.kaa;

  const atLeft = kaa.atDoor && kaa.doorSide === 'left';
  const atRight = kaa.atDoor && kaa.doorSide === 'right';

  // kaa_door.png（シャッターが開いている時だけ表示）
  dom.leftDoorChar.classList.toggle('hidden', !(atLeft && !gameState.shutters.left));
  dom.rightDoorChar.classList.toggle('hidden', !(atRight && !gameState.shutters.right));
}

// ===== Step 5: ジャンプスケアとクリア演出 =====

function triggerGameOver(character) {
  if (gameState.gameOver || gameState.cleared) return;
  gameState.gameOver = true;
  gameState.running = false;

  // カメラ閉じる
  closeCamera();

  // ジャンプスケア表示
  const jumpscareImages = {
    kitsune: 'image/charas/kitsune_jumpscare.png',
    kaa: 'image/charas/kaa_jumpscare.png',
  };

  dom.jumpscareImg.src = jumpscareImages[character] || jumpscareImages.kitsune;
  dom.jumpscareScreen.classList.remove('hidden');

  // ジャンプスケア後にゲームオーバー画面
  setTimeout(() => {
    dom.jumpscareScreen.classList.add('hidden');
    dom.blackoutOverlay.classList.add('hidden');
    dom.gameoverScreen.classList.remove('hidden');
  }, 800);
}

function gameClear() {
  if (gameState.gameOver || gameState.cleared) return;
  gameState.cleared = true;
  gameState.running = false;

  closeCamera();

  // localStorage にクリアフラグ保存
  localStorage.setItem('night1_cleared', 'true');

  // クリア画面表示
  dom.clearScreen.classList.remove('hidden');
}

function retryGame() {
  // 全画面非表示
  dom.gameoverScreen.classList.add('hidden');
  dom.jumpscareScreen.classList.add('hidden');
  dom.clearScreen.classList.add('hidden');
  dom.blackoutOverlay.classList.add('hidden');
  dom.cameraView.classList.add('hidden');

  startGame();
}

// ===== ゲームループ =====

let lastTimestamp = 0;

function gameLoop(timestamp) {
  if (!gameState.running) return;

  if (lastTimestamp === 0) lastTimestamp = timestamp;
  const dt = (timestamp - lastTimestamp) / 1000; // 秒
  lastTimestamp = timestamp;

  // 最大dt制限（タブ非アクティブ時対策）
  const clampedDt = Math.min(dt, 0.1);

  updateTime(clampedDt);
  if (gameState.cleared) return;

  updatePower(clampedDt);
  if (gameState.gameOver) return;

  updateClockGauge(clampedDt);
  if (gameState.gameOver) return;

  updateKaa(clampedDt);
  if (gameState.gameOver) return;

  // カメラ表示中ならキャラ表示更新
  if (gameState.camera.active) {
    updateCameraCharacter();
  }

  requestAnimationFrame(gameLoop);
}

// ===== 初期化 =====

function startGame() {
  initGameState();
  lastTimestamp = 0;

  // UI初期化
  dom.timeDisplay.textContent = '12:00 AM';
  dom.powerBar.style.width = '100%';
  dom.powerPercent.textContent = '100%';
  dom.powerBar.classList.remove('warning', 'danger');
  dom.clockGaugeBar.style.width = '100%';
  dom.clockGaugePercent.textContent = '100%';
  dom.clockGaugeBar.classList.remove('warning', 'danger');
  dom.leftShutterBtn.classList.remove('closed');
  dom.rightShutterBtn.classList.remove('closed');
  dom.leftShutterBtn.querySelector('.shutter-state').textContent = '開';
  dom.rightShutterBtn.querySelector('.shutter-state').textContent = '開';
  dom.leftShutterOverlay.classList.remove('closed');
  dom.rightShutterOverlay.classList.remove('closed');
  dom.leftDoorChar.classList.add('hidden');
  dom.rightDoorChar.classList.add('hidden');
  dom.clockGaugeContainer.classList.add('hidden');

  // カメラボタン初期化
  dom.camButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cam === '1');
  });

  gameState.running = true;
  requestAnimationFrame(gameLoop);
}

function setupEventListeners() {
  // カメラ開閉
  dom.cameraToggleBtn.addEventListener('click', openCamera);
  dom.cameraCloseBtn.addEventListener('click', closeCamera);

  // カメラ選択
  dom.camButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchCamera(parseInt(btn.dataset.cam));
    });
  });

  // シャッター
  dom.leftShutterBtn.addEventListener('click', () => toggleShutter('left'));
  dom.rightShutterBtn.addEventListener('click', () => toggleShutter('right'));

  // 時計巻き（CAM2表示中のカメラ映像クリック）
  dom.cameraFeed.addEventListener('click', (e) => {
    // カメラボタン等のクリックは除外
    if (e.target.closest('.cam-btn') || e.target.closest('#camera-close-btn')) return;
    windClock();
  });

  // リトライ
  dom.retryBtn.addEventListener('click', retryGame);

  // 続ける（Night2未実装なので仮）
  dom.continueBtn.addEventListener('click', () => {
    alert('Night 2 は未実装です。');
  });
}

// --- 起動 ---
document.addEventListener('DOMContentLoaded', () => {
  cacheDom();
  setupEventListeners();
  startGame();
});
