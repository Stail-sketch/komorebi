// プリセットデータ
var PRESETS = {
  housou:     { kitsune: 10, kaa: 10, ukkichi: 0,  potamaru: 0,  shisaku: 0  },
  phase2:     { kitsune: 10, kaa: 10, ukkichi: 10, potamaru: 0,  shisaku: 0  },
  zenin:      { kitsune: 10, kaa: 10, ukkichi: 10, potamaru: 10, shisaku: 0  },
  projectk:   { kitsune: 15, kaa: 15, ukkichi: 15, potamaru: 15, shisaku: 0  },
  '1997':     { kitsune: 15, kaa: 15, ukkichi: 15, potamaru: 15, shisaku: 15 },
  soutei:     { kitsune: 10, kaa: 10, ukkichi: 10, potamaru: 10, shisaku: 20 },
  yoteidoori: { kitsune: 20, kaa: 20, ukkichi: 20, potamaru: 20, shisaku: 20 }
};

var CHARS = ['kitsune', 'kaa', 'ukkichi', 'potamaru', 'shisaku'];
var levels = { kitsune: 0, kaa: 0, ukkichi: 0, potamaru: 0, shisaku: 0 };

// レベル更新
function updateLevel(char, delta) {
  levels[char] = Math.max(0, Math.min(20, levels[char] + delta));
  var levelEl = document.getElementById('level-' + char);
  levelEl.textContent = levels[char];

  var charEl = document.querySelector('.cn-char[data-char="' + char + '"]');
  charEl.setAttribute('data-active', levels[char] > 0 ? 'true' : 'false');
  charEl.setAttribute('data-maxed', levels[char] === 20 ? 'true' : 'false');
  charEl.setAttribute('data-high', levels[char] >= 15 ? 'true' : 'false');

  // レベル20でjumpscare画像に切り替え
  var img = charEl.querySelector('.cn-char-icon img');
  if (img) {
    img.src = levels[char] === 20 ? img.dataset.scare : img.dataset.normal;
  }

  // 数字がポンッと跳ねる
  levelEl.style.transform = 'scale(1.3)';
  setTimeout(function() { levelEl.style.transform = 'scale(1)'; }, 150);
}

// ◄►ボタン
document.querySelectorAll('.cn-char').forEach(function(charEl) {
  var char = charEl.dataset.char;
  charEl.querySelector('.cn-btn-minus').addEventListener('click', function() { updateLevel(char, -1); });
  charEl.querySelector('.cn-btn-plus').addEventListener('click', function() { updateLevel(char, 1); });
  charEl.setAttribute('data-active', 'false');
});

// プリセットボタン
document.querySelectorAll('.cn-preset').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var preset = PRESETS[btn.dataset.preset];
    CHARS.forEach(function(char) {
      levels[char] = preset[char];
      var levelEl = document.getElementById('level-' + char);
      levelEl.textContent = levels[char];
      var charEl = document.querySelector('.cn-char[data-char="' + char + '"]');
      charEl.setAttribute('data-active', levels[char] > 0 ? 'true' : 'false');
      charEl.setAttribute('data-maxed', levels[char] === 20 ? 'true' : 'false');
      charEl.setAttribute('data-high', levels[char] >= 15 ? 'true' : 'false');
      // 画像切り替え
      var img = charEl.querySelector('.cn-char-icon img');
      if (img) {
        img.src = levels[char] === 20 ? img.dataset.scare : img.dataset.normal;
      }
    });
  });
});

// クリア済みプリセットに★
Object.keys(PRESETS).forEach(function(key) {
  if (localStorage.getItem('custom_' + key + '_cleared') === 'true') {
    var btn = document.querySelector('.cn-preset[data-preset="' + key + '"]');
    if (btn) btn.classList.add('cleared');
  }
});

// 星の表示
function renderStars() {
  var starsEl = document.getElementById('cn-stars');
  var allGold = localStorage.getItem('yoteidoori_cleared') === 'true';
  var html = '';

  Object.keys(PRESETS).forEach(function(key) {
    var cleared = localStorage.getItem('custom_' + key + '_cleared') === 'true';
    if (allGold) {
      html += cleared ? '<span class="star-gold">\u2605</span>' : '<span class="star-empty">\u2606</span>';
    } else {
      html += cleared ? '<span class="star-filled">\u2605</span>' : '<span class="star-empty">\u2606</span>';
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
document.getElementById('cn-start').addEventListener('click', function() {
  localStorage.setItem('custom_levels', JSON.stringify(levels));

  // どのプリセットに一致するか判定
  var matchedPreset = null;
  Object.keys(PRESETS).forEach(function(key) {
    var preset = PRESETS[key];
    var match = CHARS.every(function(c) { return levels[c] === preset[c]; });
    if (match) matchedPreset = key;
  });
  localStorage.setItem('custom_current_preset', matchedPreset || 'custom');
  localStorage.setItem('custom_night', 'true');

  window.location.href = 'custom_night_game.html';
});

// Xシェアボタン
document.getElementById('cn-share').addEventListener('click', function() {
  var allCleared = localStorage.getItem('yoteidoori_cleared') === 'true';
  var text;
  if (allCleared) {
    text = 'こもれびゆうえんち。全クリア!!　#こもれびゆうえんち #ARG';
  } else {
    text = 'こもれびゆうえんち。クリア　#こもれびゆうえんち #ARG';
  }
  var url = window.location.origin;
  window.open('https://x.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank');
});

// 最初に戻る
document.getElementById('cn-back').addEventListener('click', function() {
  window.location.href = 'https://note.com/';
});


// 「ALL 20」クリック時に一瞬画面反転
var yoteidooriBtn = document.querySelector('.cn-preset[data-preset="yoteidoori"]');
if (yoteidooriBtn) {
  yoteidooriBtn.addEventListener('click', function() {
    document.body.style.filter = 'invert(1)';
    setTimeout(function() { document.body.style.filter = 'none'; }, 80);
  });
}
