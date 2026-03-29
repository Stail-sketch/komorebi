// ロゴ5回タップでNight3へ遷移（全officialページ共通）
(function() {
  if (localStorage.getItem('night2_cleared') !== 'true') return;
  if (localStorage.getItem('night3_cleared') === 'true') return;
  var logo = document.querySelector('.logo');
  if (!logo) return;
  var count = 0;
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', function() {
    count++;
    if (count >= 5) {
      window.location.href = '/game/gm_9d.html';
    }
  });
})();

// ノーマルエンド視聴後に発動する汚染エフェクト・個別変化
(function() {
  if (localStorage.getItem('normal_end_viewed') !== 'true') return;

  var night6Done = localStorage.getItem('night6_cleared') === 'true';

  // ③ 更新履歴に追加
  var historyList = document.querySelector('.history-list, .update-list');
  if (historyList) {
    var entry = document.createElement('div');
    entry.className = historyList.children[0] ? historyList.children[0].className : '';
    entry.innerHTML = '<span style="color:#888;">????/??/??</span> ■■■■■■■■';
    entry.style.color = '#444';
    historyList.insertBefore(entry, historyList.firstChild);
  }

  // ④ 5体目シルエット（Night6 ARG導線）
  var charGrid = document.querySelector('.char-grid');
  if (charGrid && !document.querySelector('.char-card-shisaku')) {
    var card = document.createElement('div');
    card.className = 'char-card char-card-shisaku';
    card.innerHTML = '<div class="char-thumb-wrapper"><div style="width:120px;height:120px;background:#111;border-radius:50%;margin:0 auto;"></div></div><h3>？？？</h3><p style="color:#666;">データが破損しています</p><a href="/official/night6_arg/SYSTEM_LOG_INDEX.html" style="color:#a33;">→ アクセスする</a>';
    charGrid.appendChild(card);
  }

  // ⑤ 放送リスト異常回
  var episodeTable = document.querySelector('.episode-table tbody, .info-table tbody');
  if (episodeTable && window.location.pathname.includes('episodes')) {
    var row = document.createElement('tr');
    row.style.color = '#a33';
    row.innerHTML = '<td>???</td><td>████.██.██</td><td style="color:#a33;">████████████████</td>';
    episodeTable.appendChild(row);
  }

  // ⑥ スタッフopacity低下
  var redacteds = document.querySelectorAll('.redacted');
  redacteds.forEach(function(el) { el.style.opacity = '0.7'; });

  // Night6クリア後は汚染CSSを適用しない
  if (!night6Done) {
    document.body.classList.add('corrupted');
  }

  // Night6クリア後は汚染エフェクトをスキップ
  if (night6Done) {
    return;
  }

  // ランダムグリッチ（30〜60秒間隔）
  function randomGlitch() {
    document.body.classList.add('glitch-flash');
    setTimeout(function() {
      document.body.classList.remove('glitch-flash');
    }, 300);
    var next = (30 + Math.random() * 30) * 1000;
    setTimeout(randomGlitch, next);
  }
  setTimeout(randomGlitch, (30 + Math.random() * 30) * 1000);

  // 黒い消失矩形（2〜4個）
  var blockCount = 2 + Math.floor(Math.random() * 3);
  for (var i = 0; i < blockCount; i++) {
    var block = document.createElement('div');
    block.className = 'corruption-block';
    block.style.width = (40 + Math.random() * 120) + 'px';
    block.style.height = (20 + Math.random() * 60) + 'px';
    block.style.top = (Math.random() * 80 + 10) + '%';
    block.style.left = (Math.random() * 80 + 5) + '%';
    block.style.opacity = (0.6 + Math.random() * 0.4).toString();
    document.body.appendChild(block);
  }

  // テキスト書き換え（3%確率で文字化け）
  var textNodes = [];
  var walker = document.createTreeWalker(
    document.querySelector('main') || document.body,
    NodeFilter.SHOW_TEXT, null, false
  );
  while (walker.nextNode()) {
    var node = walker.currentNode;
    if (node.textContent.trim().length > 0 &&
        !node.parentElement.closest('script, style, nav, header')) {
      textNodes.push(node);
    }
  }

  var corruptChars = ['█', '■', '▓', '▒', '░', '縺', '繧', '繝'];
  var kitsuneChars = ['き', 'つ', 'ね'];

  textNodes.forEach(function(node) {
    var text = node.textContent;
    var newText = '';
    for (var i = 0; i < text.length; i++) {
      if (Math.random() < 0.03 && text[i].trim()) {
        if (Math.random() < 0.4) {
          newText += kitsuneChars[Math.floor(Math.random() * kitsuneChars.length)];
        } else {
          newText += corruptChars[Math.floor(Math.random() * corruptChars.length)];
        }
      } else {
        newText += text[i];
      }
    }
    if (newText !== text) node.textContent = newText;
  });

  // ナビ崩壊（15%確率でボタンのテキストが化ける）
  var navLinks = document.querySelectorAll('.official-nav a, .bbs-nav a');
  navLinks.forEach(function(link) {
    if (Math.random() < 0.15) {
      var corruptions = ['█████', '■■■', 'ERR', '---', 'NULL'];
      link.textContent = corruptions[Math.floor(Math.random() * corruptions.length)];
      link.style.background = '#333';
      link.style.color = '#666';
    }
  });

  // 装飾化け（☆→█）
  var allText = document.querySelectorAll('main *');
  allText.forEach(function(el) {
    if (el.children.length === 0 && el.textContent.includes('☆')) {
      el.textContent = el.textContent.replace(/☆/g, '█');
    }
    if (el.children.length === 0 && el.textContent.includes('⭐')) {
      el.textContent = el.textContent.replace(/⭐/g, '█');
    }
  });

  // ② カウンター カンスト
  var counter = document.querySelector('.counter-number, .counter');
  if (counter) counter.textContent = '99999999';

  // ⑦ おしらせに「まだ ここに います」
  var newsList = document.querySelector('.news-list');
  if (newsList && window.location.pathname.includes('official/index')) {
    var item = document.createElement('div');
    item.className = 'news-item';
    item.style.color = '#a33';
    item.style.fontFamily = 'monospace';
    item.innerHTML = '<span class="news-date" style="color:#a33;">????. ??.??</span>まだ ここに います';
    newsList.appendChild(item);
  }

  // ⑧ 掲示板リンクに [!] 点滅を追加
  var bbsLinks = document.querySelectorAll('.nav-menu a[href*="bbs"], .sidebar a[href*="bbs"]');
  bbsLinks.forEach(function(link) {
    if (link.textContent.trim() === '掲示板') {
      var alert = document.createElement('span');
      alert.textContent = ' [!]';
      alert.style.cssText = 'color:#a33;font-weight:bold;animation:bbs-alert 1.2s infinite;';
      link.appendChild(alert);
      if (!document.getElementById('bbs-alert-style')) {
        var style = document.createElement('style');
        style.id = 'bbs-alert-style';
        style.textContent = '@keyframes bbs-alert{0%,100%{opacity:1;}50%{opacity:0.2;}}';
        document.head.appendChild(style);
      }
    }
  });
})();
