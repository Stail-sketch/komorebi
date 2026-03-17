// ===== こもれびゆうえんち ゲームエンジン =====
// CURRENT_NIGHT はHTMLの<script>で事前定義（未定義時はNight1）
// デバッグ: ?night=N のURLパラメータで上書き可能

// --- ブラウザの戻る・リロードを無効化 ---
history.pushState(null, '', location.href);
window.addEventListener('popstate', () => {
  history.pushState(null, '', location.href);
});
function _blockUnload(e) { e.preventDefault(); }
window.addEventListener('beforeunload', _blockUnload);
function allowNavigation() {
  window.removeEventListener('beforeunload', _blockUnload);
}
window.addEventListener('keydown', (e) => {
  // F5 リロード無効化
  if (e.key === 'F5') { e.preventDefault(); }
  // Ctrl+R リロード無効化
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') { e.preventDefault(); }
  // Alt+← 戻る無効化
  if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); }
  // Ctrl+W タブ閉じは無効化しない（ブラウザが許可しない）
});
const NIGHT_NUMBER = (typeof CURRENT_NIGHT !== 'undefined') ? CURRENT_NIGHT : 1;

// --- Night進行チェック（Night2以降は前Nightクリア必須） ---
if (NIGHT_NUMBER >= 2 && !localStorage.getItem(`night${NIGHT_NUMBER - 1}_cleared`)) {
  window.location.href = '/index.html';
}

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

// --- サウンド管理 ---

// 音量設定（0.0〜1.0 ここで一括調整）
const SOUND_VOLUMES = {
  bgm:                0.15,
  clockTick:          0.15,
  clockWarning:       0.3,
  cameraSwitch:       0.1,
  shutter:            0.08,
  kitsuneJumpscare:   0.08,
  kaaJumpscare:       0.08,
  ukkichiJumpscare:   0.08,
  potamaruDanceA:     0.3,
  potamaruDanceB:     0.3,
  potamaruJumpscare:  0.08,
  clearYay:           0.1,
  clearChime:         0.1,
};

const sounds = {};

function initSounds() {
  sounds.bgm              = createSound('sound/bgm_ambient.wav',      { loop: true, volume: SOUND_VOLUMES.bgm });
  sounds.clockTick         = createSound('sound/clock_tick.flac',       { loop: true, volume: SOUND_VOLUMES.clockTick });
  sounds.clockWarning      = createSound('sound/clock_warning.wav',     { loop: true, volume: SOUND_VOLUMES.clockWarning });
  sounds.cameraSwitch      = createSound('sound/camera_switch.wav',     { volume: SOUND_VOLUMES.cameraSwitch });
  sounds.shutter           = createSound('sound/shutter.wav',           { volume: SOUND_VOLUMES.shutter });
  sounds.kitsuneJumpscare  = createSound('sound/kitsune_jumpscare.mp3', { volume: SOUND_VOLUMES.kitsuneJumpscare });
  sounds.kaaJumpscare      = createSound('sound/kaa_jumpscare.wav',     { volume: SOUND_VOLUMES.kaaJumpscare });
  sounds.ukkichiJumpscare  = createSound('sound/ukkichi_jumpscare.ogg', { volume: SOUND_VOLUMES.ukkichiJumpscare });
  sounds.potamaruDanceA    = createSound('sound/potamaru_dance_a.mp3',  { volume: SOUND_VOLUMES.potamaruDanceA });
  sounds.potamaruDanceB    = createSound('sound/potamaru_dance_b.mp3',  { volume: SOUND_VOLUMES.potamaruDanceB });
  sounds.potamaruJumpscare = createSound('sound/potamaru_jumpscare.mp3',{ volume: SOUND_VOLUMES.potamaruJumpscare });
  sounds.clearYay          = createSound('sound/clear_yay.mp3',         { volume: SOUND_VOLUMES.clearYay });
  sounds.clearChime        = createSound('sound/clear_chime.mp3',       { volume: SOUND_VOLUMES.clearChime });
}

function createSound(src, opts = {}) {
  const audio = new Audio(src);
  audio.loop = opts.loop || false;
  audio.volume = opts.volume || 1.0;
  audio.preload = 'auto';
  return audio;
}

function playSound(sound) {
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function stopSound(sound) {
  if (!sound) return;
  sound.pause();
  sound.currentTime = 0;
}

function stopAllSounds() {
  Object.values(sounds).forEach(s => stopSound(s));
}

// --- 定数 ---
const GAME_DURATION = 180;           // 秒（リアル3分）
const POWER_CAMERA_DRAIN = 0.05;     // %/秒（全Night共通）
const POWER_SHUTTER_DRAIN = 0.25;    // %/秒・片方（全Night共通）
const CLOCK_WARNING_THRESHOLD = 30;  // チクタク警告開始（全Night共通）

// --- Night別難易度パラメータ ---
// Night2以降はここに追加するだけでOK
const NIGHT_PARAMS = {
  1: {
    powerBaseDrain:     0.05,
    clockDrain:         0.5,
    clockWindPerClick:  1,
    kaaFirstMove:       [36, 54],
    kaaMoveInterval:    [5, 9],
    kaaDoorWait:        [5, 10],
    // うっきち・ぽたまる: Night1では未登場
  },
  2: {
    powerBaseDrain:     0.06,
    clockDrain:         0.6,
    clockWindPerClick:  1,
    kaaFirstMove:       [27, 42],
    kaaMoveInterval:    [4, 8],
    kaaDoorWait:        [5, 9],
    ukkichiFirstMove:     [30, 48],
    ukkichiMoveInterval:  [6, 11],
    ukkichiDoorWait:      [6, 10],
  },
  3: {
    powerBaseDrain:     0.07,
    clockDrain:         0.7,
    clockWindPerClick:  1,
    kaaFirstMove:       [18, 33],
    kaaMoveInterval:    [4, 7],
    kaaDoorWait:        [4, 8],
    ukkichiFirstMove:     [24, 39],
    ukkichiMoveInterval:  [5, 9],
    ukkichiDoorWait:      [5, 8],
    potamaruFirstMusic:   [24, 42],
    potamaruMusicInterval:[18, 36],
    potamaruRushTime:     3,
  },
  4: {
    powerBaseDrain:     0.08,
    clockDrain:         1.0,
    clockWindPerClick:  1,
    kaaFirstMove:       [18, 30],
    kaaMoveInterval:    [4, 7],
    kaaDoorWait:        [5, 8],
    ukkichiFirstMove:     [24, 36],
    ukkichiMoveInterval:  [5, 9],
    ukkichiDoorWait:      [5, 8],
    potamaruFirstMusic:   [24, 39],
    potamaruMusicInterval:[15, 30],
    potamaruRushTime:     3,
  },
  5: {
    powerBaseDrain:     0.08,
    clockDrain:         0.8,
    clockWindPerClick:  1,
    kaaFirstMove:       [18, 33],
    kaaMoveInterval:    [4, 7],
    kaaDoorWait:        [5, 8],
    ukkichiFirstMove:     [24, 36],
    ukkichiMoveInterval:  [5, 9],
    ukkichiDoorWait:      [5, 8],
    potamaruFirstMusic:   [24, 39],
    potamaruMusicInterval:[15, 30],
    potamaruRushTime:     3,
  },
  6: {
    powerBaseDrain:     0.08,
    clockDrain:         1.0,
    clockWindPerClick:  1,
    kaaFirstMove:       [18, 30],
    kaaMoveInterval:    [4, 7],
    kaaDoorWait:        [5, 8],
    ukkichiFirstMove:     [24, 36],
    ukkichiMoveInterval:  [5, 9],
    ukkichiDoorWait:      [5, 8],
    potamaruFirstMusic:   [24, 39],
    potamaruMusicInterval:[15, 30],
    potamaruRushTime:     3,
  },
};

// 現在のNightのパラメータを取得
function getNightParams() {
  return NIGHT_PARAMS[gameState.night] || NIGHT_PARAMS[1];
}

// --- 試作きつね (Night6 only) ---
let shisakuActive = false;
let shisakuCamera = -1;
let shisakuTimer = null;
let shisakuCheckEnabled = false;
let gameStartTime = 0;

// --- ゲーム状態 ---
let gameState = {};

function initGameState() {
  gameState = {
    night: NIGHT_NUMBER,
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
        nextMoveTime: 0,
        atDoor: false,
        doorSide: null,
        doorArrivalTime: 0,
      },
      ukkichi: {
        position: 'cam5',
        nextMoveTime: 0,
        atDoor: false,
        doorSide: null,
        doorArrivalTime: 0,
        active: false, // Night2以降でtrue
      },
      potamaru: {
        position: 'cam3',
        nextMusicTime: 0,
        rushing: false,
        rushSide: null,
        rushDeadline: 0,
        active: false, // Night3以降でtrue
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
    introScreen: $('intro-screen'),
    hud: $('hud'),
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
    officeBgOpen: $('office-bg-open'),
    officeBgClosed: $('office-bg-closed'),
    leftDoorChar: $('left-door-char'),
    rightDoorChar: $('right-door-char'),
    cameraNoise: $('camera-noise'),
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
  triggerCameraNoise();
  updateCameraView();
}

function closeCamera() {
  gameState.camera.active = false;
  dom.cameraView.classList.add('hidden');
  stopSound(sounds.clockTick);
  stopSound(sounds.clockWarning);
}

function switchCamera(camNum) {
  if (gameState.gameOver || gameState.cleared) return;
  gameState.camera.current = camNum;

  // ボタンのactive状態更新
  dom.camButtons.forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.cam) === camNum);
  });

  // ノイズトランジション
  triggerCameraNoise();

  updateCameraView();
  updateShisakuDisplay();
}

function triggerCameraNoise() {
  dom.cameraNoise.classList.remove('hidden', 'active');
  void dom.cameraNoise.offsetWidth;
  dom.cameraNoise.classList.add('active');
  playSound(sounds.cameraSwitch);
  setTimeout(() => {
    dom.cameraNoise.classList.remove('active');
    dom.cameraNoise.classList.add('hidden');
  }, 150);
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
  // うっきち
  if (gameState.characters.ukkichi.active && gameState.characters.ukkichi.position === camKey) {
    charImg = 'image/charas/ukkichi_normal.png';
  }
  // ぽたまる
  if (gameState.characters.potamaru.active && gameState.characters.potamaru.position === camKey) {
    charImg = 'image/charas/potamaru_normal.png';
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
  btn.classList.toggle('closed', closed);
  btn.querySelector('.shutter-state').textContent = closed ? '閉' : '開';
  playSound(sounds.shutter);

  // シャッターを閉じた時、扉前のキャラを撃退
  if (closed) {
    const np = getNightParams();
    const kaa = gameState.characters.kaa;
    if (kaa.atDoor && kaa.doorSide === side) {
      kaa.position = 'cam4';
      kaa.atDoor = false;
      kaa.doorSide = null;
      kaa.nextMoveTime = gameState.time + randomRange(np.kaaMoveInterval[0], np.kaaMoveInterval[1]);
    }
    const ukkichi = gameState.characters.ukkichi;
    if (ukkichi.active && ukkichi.atDoor && ukkichi.doorSide === side) {
      ukkichi.position = 'cam5';
      ukkichi.atDoor = false;
      ukkichi.doorSide = null;
      ukkichi.nextMoveTime = gameState.time + randomRange(np.ukkichiMoveInterval[0], np.ukkichiMoveInterval[1]);
    }
    // ぽたまる: rushing中にシャッター閉で撃退
    const potamaru = gameState.characters.potamaru;
    if (potamaru.active && potamaru.rushing && potamaru.rushSide === side) {
      potamaru.rushing = false;
      potamaru.rushSide = null;
      potamaru.position = 'cam3';
      potamaru.nextMusicTime = gameState.time + randomRange(np.potamaruMusicInterval[0], np.potamaruMusicInterval[1]);
    }

    // 試作きつね: シャッター閉時にスポーン判定
    checkShisakuSpawn();
  }

  updateClosedBgClip();
  updateDoorSilhouettes();
}

function updateClosedBgClip() {
  const leftClosed = gameState.shutters.left;
  const rightClosed = gameState.shutters.right;

  dom.officeBgClosed.classList.remove('hidden', 'show-left', 'show-right', 'show-both');

  if (leftClosed && rightClosed) {
    dom.officeBgClosed.classList.add('show-both');
  } else if (leftClosed) {
    dom.officeBgClosed.classList.add('show-left');
  } else if (rightClosed) {
    dom.officeBgClosed.classList.add('show-right');
  } else {
    dom.officeBgClosed.classList.add('hidden');
  }
}

// ===== Step 2: ゲームタイマーと電力 =====

function updateTime(dt) {
  gameState.time += dt;

  // 時刻表示更新
  const hours = Math.floor(gameState.time / 30); // 30秒 = 1時間
  const displayHour = hours === 0 ? 12 : hours;
  const ampm = hours < 6 ? 'AM' : 'AM';
  dom.timeDisplay.textContent = `${displayHour}:00 AM`;

  // 6AM到達
  if (gameState.time >= GAME_DURATION) {
    gameClear();
  }
}

function updatePower(dt) {
  let drain = getNightParams().powerBaseDrain;

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
  dom.officeBgClosed.classList.remove('show-left', 'show-right', 'show-both');
  dom.officeBgClosed.classList.add('hidden');

  dom.blackoutOverlay.classList.remove('hidden');

  // 少し待ってからゲームオーバー
  setTimeout(() => {
    triggerGameOver('kitsune');
  }, 2000);
}

// ===== Step 3: キツネ団長（時計ギミック） =====

function updateClockGauge(dt) {
  gameState.clockGauge -= getNightParams().clockDrain * dt;
  if (gameState.clockGauge < 0) gameState.clockGauge = 0;

  // ゲージ表示更新
  const pct = Math.ceil(gameState.clockGauge);
  dom.clockGaugeBar.style.width = pct + '%';
  dom.clockGaugePercent.textContent = pct + '%';

  // 色変化 + 音切替
  dom.clockGaugeBar.classList.remove('warning', 'danger');
  if (pct <= 15) {
    dom.clockGaugeBar.classList.add('danger');
  } else if (pct <= CLOCK_WARNING_THRESHOLD) {
    dom.clockGaugeBar.classList.add('warning');
  }

  // チクタク音の切替（CAM2表示中のみ再生）
  const onCam2 = gameState.camera.active && gameState.camera.current === 2;
  if (!onCam2 || pct <= 0) {
    stopSound(sounds.clockTick);
    stopSound(sounds.clockWarning);
  } else if (pct <= CLOCK_WARNING_THRESHOLD) {
    if (sounds.clockWarning.paused) {
      stopSound(sounds.clockTick);
      sounds.clockWarning.play().catch(() => {});
    }
  } else {
    if (sounds.clockTick.paused) {
      stopSound(sounds.clockWarning);
      sounds.clockTick.play().catch(() => {});
    }
  }

  // ゲージ0 → 即死
  if (gameState.clockGauge <= 0) {
    triggerGameOver('kitsune');
  }
}

function windClock() {
  if (!gameState.camera.active || gameState.camera.current !== 2) return;
  if (gameState.gameOver || gameState.cleared) return;

  gameState.clockGauge = Math.min(100, gameState.clockGauge + getNightParams().clockWindPerClick);
}

// ===== Step 4: かあ博士（ランダム移動） =====

const KAA_MOVE_PATH_AFTER_CAM6 = ['cam7', 'cam8'];

function updateKaa(dt) {
  const kaa = gameState.characters.kaa;

  if (kaa.atDoor) {
    // 扉前待機中
    const waitTime = gameState.time - kaa.doorArrivalTime;
    const maxWait = randomRange(getNightParams().kaaDoorWait[0], getNightParams().kaaDoorWait[1]);

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
        kaa.nextMoveTime = gameState.time + randomRange(getNightParams().kaaMoveInterval[0], getNightParams().kaaMoveInterval[1]);
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
      kaa.nextMoveTime = gameState.time + randomRange(getNightParams().kaaMoveInterval[0], getNightParams().kaaMoveInterval[1]);
      break;

    case 'cam6':
      // ランダムで左右
      kaa.position = Math.random() < 0.5 ? 'cam7' : 'cam8';
      kaa.nextMoveTime = gameState.time + randomRange(getNightParams().kaaMoveInterval[0], getNightParams().kaaMoveInterval[1]);
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

// ===== うっきち（反対側の扉から侵入） =====

function updateUkkichi(dt) {
  const ukkichi = gameState.characters.ukkichi;
  if (!ukkichi.active) return;

  if (ukkichi.atDoor) {
    // 扉前待機中
    const np = getNightParams();
    const waitTime = gameState.time - ukkichi.doorArrivalTime;
    const maxWait = randomRange(np.ukkichiDoorWait[0], np.ukkichiDoorWait[1]);

    if (waitTime >= maxWait) {
      const shutterClosed = ukkichi.doorSide === 'left'
        ? gameState.shutters.left
        : gameState.shutters.right;

      if (shutterClosed) {
        // 撃退 → CAM5に戻る
        ukkichi.position = 'cam5';
        ukkichi.atDoor = false;
        ukkichi.doorSide = null;
        ukkichi.nextMoveTime = gameState.time + randomRange(np.ukkichiMoveInterval[0], np.ukkichiMoveInterval[1]);
        updateDoorSilhouettes();
        if (gameState.camera.active) updateCameraCharacter();
      } else {
        // 侵入 → ゲームオーバー
        triggerGameOver('ukkichi');
      }
    }
    return;
  }

  // 移動タイミングチェック
  if (gameState.time < ukkichi.nextMoveTime) return;

  const np = getNightParams();

  switch (ukkichi.position) {
    case 'cam5':
      ukkichi.position = 'cam6';
      ukkichi.nextMoveTime = gameState.time + randomRange(np.ukkichiMoveInterval[0], np.ukkichiMoveInterval[1]);
      break;

    case 'cam6':
      // ランダムで左右の通路へ
      ukkichi.position = Math.random() < 0.5 ? 'cam7' : 'cam8';
      ukkichi.nextMoveTime = gameState.time + randomRange(np.ukkichiMoveInterval[0], np.ukkichiMoveInterval[1]);
      break;

    case 'cam7':
      // 左通路にいる → 反対側（右扉）から侵入
      ukkichi.position = 'door_right';
      ukkichi.atDoor = true;
      ukkichi.doorSide = 'right';
      ukkichi.doorArrivalTime = gameState.time;
      updateDoorSilhouettes();
      break;

    case 'cam8':
      // 右通路にいる → 反対側（左扉）から侵入
      ukkichi.position = 'door_left';
      ukkichi.atDoor = true;
      ukkichi.doorSide = 'left';
      ukkichi.doorArrivalTime = gameState.time;
      updateDoorSilhouettes();
      break;
  }

  if (gameState.camera.active) updateCameraCharacter();
}

// ===== ぽたまる（ダンス音楽ギミック） =====

function updatePotamaru(dt) {
  const potamaru = gameState.characters.potamaru;
  if (!potamaru.active) return;

  if (potamaru.rushing) {
    // 突進中 → 猶予時間チェック
    if (gameState.time >= potamaru.rushDeadline) {
      const shutterClosed = potamaru.rushSide === 'left'
        ? gameState.shutters.left
        : gameState.shutters.right;

      if (shutterClosed) {
        // 撃退 → CAM3に戻る
        const np = getNightParams();
        potamaru.rushing = false;
        potamaru.rushSide = null;
        potamaru.position = 'cam3';
        potamaru.nextMusicTime = gameState.time + randomRange(np.potamaruMusicInterval[0], np.potamaruMusicInterval[1]);
        updateDoorSilhouettes();
        if (gameState.camera.active) updateCameraCharacter();
      } else {
        // 侵入 → ゲームオーバー
        triggerGameOver('potamaru');
      }
    }
    return;
  }

  // 音楽発動タイミングチェック
  if (gameState.time < potamaru.nextMusicTime) return;

  const np = getNightParams();

  // ランダムで音楽A（右）orB（左）
  if (Math.random() < 0.5) {
    // 音楽A → 右扉へ
    playSound(sounds.potamaruDanceA);
    potamaru.rushSide = 'right';
  } else {
    // 音楽B → 左扉へ
    playSound(sounds.potamaruDanceB);
    potamaru.rushSide = 'left';
  }

  potamaru.rushing = true;
  potamaru.position = potamaru.rushSide === 'right' ? 'cam8' : 'cam7';
  potamaru.rushDeadline = gameState.time + np.potamaruRushTime;
  updateDoorSilhouettes();
  if (gameState.camera.active) updateCameraCharacter();
}

function updateDoorSilhouettes() {
  const kaa = gameState.characters.kaa;
  const ukkichi = gameState.characters.ukkichi;

  // 左扉前にいるキャラ
  let leftChar = null;
  if (kaa.atDoor && kaa.doorSide === 'left') leftChar = 'kaa';
  if (ukkichi.active && ukkichi.atDoor && ukkichi.doorSide === 'left') leftChar = 'ukkichi';

  // 右扉前にいるキャラ
  let rightChar = null;
  if (kaa.atDoor && kaa.doorSide === 'right') rightChar = 'kaa';
  if (ukkichi.active && ukkichi.atDoor && ukkichi.doorSide === 'right') rightChar = 'ukkichi';

  // 左扉
  if (leftChar && !gameState.shutters.left) {
    dom.leftDoorChar.src = `image/charas/${leftChar}_door.png`;
    dom.leftDoorChar.classList.remove('hidden');
  } else {
    dom.leftDoorChar.classList.add('hidden');
  }

  // 右扉
  if (rightChar && !gameState.shutters.right) {
    dom.rightDoorChar.src = `image/charas/${rightChar}_door.png`;
    dom.rightDoorChar.classList.remove('hidden');
  } else {
    dom.rightDoorChar.classList.add('hidden');
  }
}

// ===== 試作きつね (Night6) =====

function checkShisakuSpawn() {
  if (NIGHT_NUMBER !== 6 || shisakuActive || !gameState.running) return;

  // Time-based probability
  var elapsed = (Date.now() - gameStartTime) / 1000;
  var hour = Math.floor(elapsed / 30); // 0-5 (12AM-5AM)
  var probs = [0.05, 0.07, 0.10, 0.13, 0.17, 0.20];
  var prob = probs[Math.min(hour, 5)];

  if (Math.random() < prob) {
    spawnShisaku();
  }
}

function spawnShisaku() {
  shisakuActive = true;
  // Random camera (1-8)
  shisakuCamera = Math.floor(Math.random() * 8) + 1;

  // 全画面ノイズ（警備室＋カメラ両方に適用）
  var noiseTargets = [
    document.getElementById('camera-view'),
    document.getElementById('office-view'),
    document.querySelector('.game-container')
  ];
  noiseTargets.forEach(function(el) {
    if (el) {
      el.style.filter = 'invert(1) hue-rotate(90deg)';
      setTimeout(function() { el.style.filter = ''; }, 500);
    }
  });

  // Show shisaku if player is viewing the correct camera
  updateShisakuDisplay();

  // 10 second timer - if not clicked, game over
  shisakuTimer = setTimeout(function() {
    if (shisakuActive) {
      triggerGameOver('kitsune');
    }
  }, 10000);
}

function updateShisakuDisplay() {
  var overlay = document.getElementById('shisaku-overlay');
  if (!overlay) return;

  if (shisakuActive && gameState.camera.active && gameState.camera.current === shisakuCamera) {
    overlay.style.display = 'block';
    // Random position
    var img = document.getElementById('shisaku-img');
    if (img) {
      img.style.left = (20 + Math.random() * 40) + '%';
      img.style.bottom = '5%';
    }
  } else {
    overlay.style.display = 'none';
  }
}

function clickShisaku() {
  if (!shisakuActive) return;
  shisakuActive = false;
  clearTimeout(shisakuTimer);
  shisakuCamera = -1;
  var overlay = document.getElementById('shisaku-overlay');
  if (overlay) overlay.style.display = 'none';
  // Brief noise effect on clear（全画面）
  var clearTargets = [
    document.getElementById('camera-view'),
    document.getElementById('office-view'),
    document.querySelector('.game-container')
  ];
  clearTargets.forEach(function(el) {
    if (el) {
      el.style.filter = 'invert(0.5)';
      setTimeout(function() { el.style.filter = ''; }, 200);
    }
  });
}

// ===== Step 5: ジャンプスケアとクリア演出 =====

function triggerGameOver(character) {
  if (gameState.gameOver || gameState.cleared) return;
  gameState.gameOver = true;
  gameState.running = false;

  // 全サウンド停止 → ジャンプスケア音
  stopAllSounds();
  closeCamera();

  // ジャンプスケア表示
  const jumpscareImages = {
    kitsune: 'image/charas/kitsune_jumpscare.png',
    kaa: 'image/charas/kaa_jumpscare.png',
    ukkichi: 'image/charas/ukkichi_jumpscare.png',
    potamaru: 'image/charas/potamaru_jumpscare.png',
  };
  const jumpscareSounds = {
    kitsune: sounds.kitsuneJumpscare,
    kaa: sounds.kaaJumpscare,
    ukkichi: sounds.ukkichiJumpscare,
    potamaru: sounds.potamaruJumpscare,
  };

  dom.jumpscareImg.src = jumpscareImages[character] || jumpscareImages.kitsune;
  dom.jumpscareScreen.classList.remove('hidden');
  playSound(jumpscareSounds[character] || sounds.kitsuneJumpscare);

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

  stopAllSounds();
  closeCamera();

  // localStorage にクリアフラグ保存
  localStorage.setItem(`night${NIGHT_NUMBER}_cleared`, 'true');

  // Night6: クリア画面なし → 即座に真エンディングへ
  if (NIGHT_NUMBER === 6) {
    // 画面を黒のまま、音なし、1秒後に遷移
    setTimeout(() => {
      allowNavigation();
      window.location.href = 'true_ending.html';
    }, 1000);
    return;
  }

  // クリア画面表示（Night1〜5）
  playSound(sounds.clearChime);
  dom.clearScreen.classList.remove('hidden');
  setTimeout(() => {
    playSound(sounds.clearYay);
  }, 500);

  // Night5: メインエンディング演出
  if (NIGHT_NUMBER === 5) {
    setTimeout(() => night5Ending(), 3000);
  } else {
    // Night1〜4: 数秒後にファンサイトTOPへ自動遷移
    setTimeout(() => {
      allowNavigation();
      window.location.href = '/index.html';
    }, 4000);
  }
}

// ===== Night5 メインエンディング演出 =====
function night5Ending() {
  const endingScreen = document.getElementById('ending-screen');
  const endingText = document.getElementById('ending-text');
  const metaScreen = document.getElementById('meta-screen');
  const metaMessage = document.getElementById('meta-message');
  const night6Btn = document.getElementById('night6-btn');

  if (!endingScreen || !metaScreen) return;

  // クリア画面をフェードアウト
  dom.clearScreen.classList.add('hidden');

  // エンディング画面表示
  endingScreen.classList.remove('hidden');

  // テキスト演出シーケンス
  const sequence = [
    { text: '全員の記録が正常化されました', delay: 1000 },
    { text: '', delay: 4000 },   // フェードアウト
    { text: '悠具志 業\u3000状態：変化なし', delay: 6000 },
    { text: '', delay: 10000 },  // フェードアウト
  ];

  let i = 0;
  function showNext() {
    if (i >= sequence.length) {
      // メタ的ページへ
      endingScreen.classList.add('hidden');
      showMetaScreen();
      return;
    }

    const step = sequence[i];
    if (step.text) {
      endingText.textContent = step.text;
      endingText.classList.add('visible');
    } else {
      endingText.classList.remove('visible');
    }

    i++;
    setTimeout(showNext, i < sequence.length ? sequence[i].delay - sequence[i - 1].delay : 2000);
  }

  setTimeout(showNext, sequence[0].delay);

  function showMetaScreen() {
    metaScreen.classList.remove('hidden');
    metaMessage.innerHTML =
      'おめでとうございます。ゲームをクリアしました。<br><br>' +
      'このゲームを遊んでくれてありがとう。';

    // Night6入口（仮表示）
    if (night6Btn) {
      night6Btn.classList.remove('hidden');
      night6Btn.textContent = '...';
      night6Btn.addEventListener('click', () => {
        allowNavigation();
        window.location.href = 'night6.html';
      });
    }
  }
}

function retryGame() {
  // 全画面非表示
  dom.gameoverScreen.classList.add('hidden');
  dom.jumpscareScreen.classList.add('hidden');
  dom.clearScreen.classList.add('hidden');
  dom.blackoutOverlay.classList.add('hidden');
  dom.cameraView.classList.add('hidden');
  // エンディング画面（Night5用）
  const endingScreen = document.getElementById('ending-screen');
  const metaScreen = document.getElementById('meta-screen');
  if (endingScreen) endingScreen.classList.add('hidden');
  if (metaScreen) metaScreen.classList.add('hidden');

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

  updateUkkichi(clampedDt);
  if (gameState.gameOver) return;

  updatePotamaru(clampedDt);
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
  const np = getNightParams();
  gameState.characters.kaa.nextMoveTime = randomRange(np.kaaFirstMove[0], np.kaaFirstMove[1]);

  // Night2以降: うっきち
  if (NIGHT_NUMBER >= 2 && np.ukkichiFirstMove) {
    gameState.characters.ukkichi.active = true;
    gameState.characters.ukkichi.nextMoveTime = randomRange(np.ukkichiFirstMove[0], np.ukkichiFirstMove[1]);
  }

  // Night3以降: ぽたまる
  if (NIGHT_NUMBER >= 3 && np.potamaruFirstMusic) {
    gameState.characters.potamaru.active = true;
    gameState.characters.potamaru.nextMusicTime = randomRange(np.potamaruFirstMusic[0], np.potamaruFirstMusic[1]);
  }

  lastTimestamp = 0;
  stopAllSounds();

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
  dom.officeBgClosed.classList.remove('show-left', 'show-right', 'show-both');
  dom.officeBgClosed.classList.add('hidden');
  dom.leftDoorChar.classList.add('hidden');
  dom.rightDoorChar.classList.add('hidden');
  dom.clockGaugeContainer.classList.add('hidden');

  // カメラボタン初期化
  dom.camButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cam === '1');
  });

  // イントロ演出（クリック待ち）
  dom.introScreen.classList.remove('fade-out');
  dom.introScreen.classList.remove('hidden');
  dom.hud.classList.add('hidden');

  // クリックでゲーム開始（ブラウザ自動再生ポリシー回避）
  function onIntroClick() {
    dom.introScreen.removeEventListener('click', onIntroClick);

    // AudioContext resume（自動再生制限の解除）
    if (window.AudioContext || window.webkitAudioContext) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume().then(() => ctx.close());
    }

    // フェードアウト開始 & BGM再生
    dom.introScreen.classList.add('fade-out');
    sounds.bgm.play().catch(() => {});

    // フェードアウト完了後にゲーム開始
    setTimeout(() => {
      dom.introScreen.classList.add('hidden');
      dom.hud.classList.remove('hidden');
      gameState.running = true;
      gameStartTime = Date.now();
      requestAnimationFrame(gameLoop);
    }, 1000);
  }

  dom.introScreen.addEventListener('click', onIntroClick);
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

  // 続ける → ファンサイトTOPへ
  if (dom.continueBtn) {
    dom.continueBtn.addEventListener('click', () => {
      allowNavigation();
      window.location.href = '/index.html';
    });
  }

  // 試作きつね クリックハンドラ
  var shisakuImg = document.getElementById('shisaku-img');
  if (shisakuImg) {
    shisakuImg.addEventListener('click', clickShisaku);
  }
}

// --- 起動 ---
document.addEventListener('DOMContentLoaded', () => {
  // 画像ドラッグ・右クリック無効化
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('contextmenu', e => e.preventDefault());

  cacheDom();
  initSounds();
  setupEventListeners();

  // Night番号をHTMLに反映
  const introText = document.getElementById('intro-text');
  const nightLabel = document.getElementById('night-label');
  const clearText = document.getElementById('clear-text');
  if (introText) introText.textContent = `Night ${NIGHT_NUMBER}`;
  if (nightLabel) nightLabel.textContent = `Night ${NIGHT_NUMBER}`;
  if (clearText) clearText.textContent = `Night ${NIGHT_NUMBER} クリア`;
  document.title = `こもれびゆうえんち - Night ${NIGHT_NUMBER}`;

  startGame();
});
