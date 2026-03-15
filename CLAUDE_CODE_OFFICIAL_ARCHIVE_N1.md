# Claude Code 実装指示書：公式アーカイブ（Night1後・10ページ）

## 概要

Night1クリア後に解放される「木漏れ日遊園地」の公式アーカイブサイトを実装する。
ファンサイトとは対照的に、番組制作側の公式サイトを模した作り。

**重要な設計原則：**
- ファンサイトとは完全に異なるデザイン。公式感のある落ち着いたデザイン
- 2000年代の企業・番組公式サイト風（テレビ局の番組ページ的な雰囲気）
- 表面上は普通の公式サイトだが、よく見ると不穏な要素がある
- Night2入口（うっきちページの画像ギミック）を仕込む
- ロアの伏線（スタッフ紹介の塗りつぶし、試作きつね不在）を配置

---

## ファイル構成

```
komorebi/
├── official/
│   ├── index.html              （1. トップページ）
│   ├── about.html              （2. 番組紹介）
│   ├── characters/
│   │   ├── index.html          （3. キャラクター一覧）
│   │   ├── kitsune.html        （4. キツネ団長 詳細）
│   │   ├── kaa.html            （5. かあ博士 詳細）
│   │   ├── potamaru.html       （6. ぽたまる 詳細）
│   │   └── ukkichi.html        （7. うっきち 詳細）★Night2入口
│   ├── staff.html              （8. スタッフ紹介）★ロア
│   ├── episodes.html           （9. 放送リスト）
│   ├── contact.html            （10. お問い合わせフォーム）
│   ├── css/
│   │   └── official.css
│   └── images/
│       ├── logo.png            （番組ロゴ）
│       ├── header_bg.png       （ヘッダー背景）
│       ├── characters/
│       │   ├── kitsune_thumb.png
│       │   ├── kitsune_full.png
│       │   ├── kaa_thumb.png
│       │   ├── kaa_full.png
│       │   ├── potamaru_thumb.png
│       │   ├── potamaru_full.png
│       │   ├── ukkichi_thumb.png
│       │   ├── ukkichi_full.png
│       │   └── ukkichi_hover.png  ★Night2入口用
│       └── staff/
│           └── (スタッフ写真プレースホルダー)
```

**画像について：** 全画像はプレースホルダーで仮実装。CSSで色付き矩形＋テキストで代替。

---

## デザイン仕様（2000年代公式番組サイト風）

### 設計コンセプト

ファンサイトが「個人の手作り感」なのに対し、公式アーカイブは「企業が作った公式ページ」。
ただし、2000年代のテレビ局の番組ページレベル（現代のWebとは異なる）。

**参考イメージ：** 2000年代のNHK教育テレビの番組公式ページ、地方テレビ局の番組紹介ページ

### CSS

```css
/* ===== 公式アーカイブCSS ===== */

body {
    background-color: #ffffff;
    font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "ＭＳ Ｐゴシック", sans-serif;
    font-size: 13px;
    color: #333333;
    margin: 0;
    padding: 0;
}

/* ヘッダー */
.official-header {
    background: linear-gradient(to bottom, #4a8c3f, #6ab85e);
    /* 緑のグラデーション。番組の自然・遊園地テーマに合わせて */
    padding: 15px 0;
    text-align: center;
    border-bottom: 3px solid #2d6b25;
}

.official-header .logo {
    /* 番組ロゴ */
    font-size: 28px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    letter-spacing: 4px;
}

.official-header .subtitle {
    font-size: 12px;
    color: #d4f0cd;
    margin-top: 4px;
}

/* ナビゲーション */
.official-nav {
    background-color: #f0f8ee;
    border-bottom: 1px solid #cce5c5;
    padding: 8px 0;
    text-align: center;
}

.official-nav a {
    color: #336633;
    text-decoration: none;
    margin: 0 15px;
    font-size: 12px;
    font-weight: bold;
}

.official-nav a:hover {
    color: #4a8c3f;
    text-decoration: underline;
}

/* メインコンテンツ */
.official-main {
    max-width: 900px;
    margin: 20px auto;
    padding: 0 20px;
}

/* セクション見出し */
.section-title {
    font-size: 18px;
    color: #336633;
    border-left: 4px solid #4a8c3f;
    padding-left: 10px;
    margin: 25px 0 15px;
}

/* カード（キャラクター等） */
.card {
    border: 1px solid #dde8da;
    border-radius: 4px;
    padding: 15px;
    margin: 10px 0;
    background-color: #fafcf9;
}

/* フッター */
.official-footer {
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
    padding: 15px;
    text-align: center;
    font-size: 10px;
    color: #999;
    margin-top: 40px;
}

/* テーブル */
table.official-table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
}

table.official-table th {
    background-color: #4a8c3f;
    color: #fff;
    padding: 8px 12px;
    text-align: left;
    font-size: 12px;
}

table.official-table td {
    padding: 8px 12px;
    border-bottom: 1px solid #eee;
    font-size: 12px;
}

table.official-table tr:nth-child(even) td {
    background-color: #f8faf7;
}

/* 塗りつぶし表現 */
.redacted {
    background-color: #333;
    color: #333;
    padding: 0 2px;
    user-select: none;
    cursor: default;
}

/* Night2入口：うっきち画像のホバー効果 */
.ukkichi-image-container {
    position: relative;
    display: inline-block;
}

.ukkichi-image-container .normal {
    display: block;
}

.ukkichi-image-container .hover-image {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
}

.ukkichi-image-container:hover .normal {
    display: none;
}

.ukkichi-image-container:hover .hover-image {
    display: block;
    cursor: pointer;
}
```

---

## ページ別詳細

### 1. トップページ（index.html）

**ページタイトル：** 木漏れ日遊園地 公式アーカイブ

**構成：**
```
┌─────────────────────────────────┐
│  [ヘッダー：番組ロゴ＋タイトル]    │
│  「木漏れ日遊園地」                │
│   きらら放送 毎週土曜 8:30〜9:00   │
├─────────────────────────────────┤
│  [ナビゲーション]                  │
│  番組紹介 | キャラクター | スタッフ │
│  | 放送リスト | お問い合わせ        │
├─────────────────────────────────┤
│                                    │
│  ■ 木漏れ日遊園地へようこそ！      │
│                                    │
│  [メインビジュアル]                │
│  キャラクター4体の集合イメージ      │
│                                    │
│  番組紹介文                        │
│                                    │
│  ■ おしらせ                       │
│  （更新情報・最終更新は放送終了頃） │
│                                    │
├─────────────────────────────────┤
│  [フッター]                        │
│  © ゆめスタジオプロダクション       │
│  きらら放送                        │
└─────────────────────────────────┘
```

**テキスト内容：**

```
■ 木漏れ日遊園地へようこそ！

キツネ団長やかあ博士たちと一緒に、楽しく遊んで学ぼう！
「木漏れ日遊園地」は子どもたちの好奇心と元気を応援する番組です。

毎週土曜日、朝8時30分からきらら放送でお届けしています。
スタジオの中にある「木漏れ日遊園地」で、今週はどんな冒険が待っているかな？

■ おしらせ

1997.09.20  来週の放送予定について
1997.09.13  秋の特別企画のお知らせ
1997.08.30  夏休みスペシャル放送ありがとうございました
1997.08.02  夏休みスペシャル放送のお知らせ
1997.07.05  「みんなであそぼう！」収録参加者募集
```

**実装注意：**
- おしらせは1997年で止まっている（打ち切り時点）
- 「来週の放送予定について」が最新。これが最終回の予告に相当する
- フッターの「© ゆめスタジオプロダクション」は存在しない会社
- **ロゴ部分は後でNight3入口（ロゴ5回クリック）に使うため、クリックイベントを仕込める構造にしておく**
- ただしNight1後の段階ではロゴクリックは何も起きない。Night2クリア後にJSで有効化

```javascript
// Night3入口用（Night2クリア後に有効化）
// 初期状態では無効
let logoClickCount = 0;
const logo = document.querySelector('.logo');

// この関数はNight2クリアフラグがある場合のみ有効
function enableLogoSecret() {
    logo.addEventListener('click', function() {
        logoClickCount++;
        if (logoClickCount >= 5) {
            // Night3入口を表示
            window.location.href = '/game/night3.html';
        }
    });
}
```

---

### 2. 番組紹介（about.html）

**ページタイトル：** 番組紹介

**テキスト内容：**

```
■ 番組紹介

「木漏れ日遊園地」は、きらら放送が制作する子ども向け教育エンターテインメント番組です。

スタジオの中に再現された「木漏れ日遊園地」を舞台に、個性豊かなキャラクターたちが
子どもたちと一緒に遊び、学び、成長していきます。

━━━━━ 番組概要 ━━━━━

番組名：木漏れ日遊園地
放送局：きらら放送
放送時間：毎週土曜日 8:30〜9:00（30分）
放送開始：1991年4月
対象年齢：4歳〜10歳
形式：実写スタジオ＋人形劇
制作：株式会社ゆめスタジオプロダクション
企画・監修：████████

━━━━━ 番組の特徴 ━━━━━

◆ 遊園地がスタジオに！
番組のセットは「遊園地」をまるごと再現。観覧車やメリーゴーラウンドのミニチュアが
並ぶ楽しい空間で、毎週さまざまな冒険が繰り広げられます。

◆ 個性豊かなキャラクター
司会役のキツネ団長、物知りのかあ博士、ダンス大好きなぽたまる、
いたずら好きのうっきち。4人のキャラクターがお子さまをお待ちしています。

◆ 楽しく学べるコーナー
遊びながら自然に学べる工夫がいっぱい。
「かあ博士のなぜなぜ教室」では科学や自然の不思議をわかりやすく解説します。

◆ お子さまも参加できる！
「みんなであそぼう！」のコーナーでは、スタジオにお子さまをお招きして
キャラクターたちと一緒に遊ぶことができます。参加者は応募の中から抽選で選ばれます。
```

**実装注意：**
- 「企画・監修：████████」→ **塗りつぶし表現**。`.redacted` クラスを使用
- これがロアの伏線（謎の担当者の存在を示す。名前が意図的に消されている）
- 塗りつぶしはマウスで選択しても読めない実装にする（`user-select: none` ＋ 背景色と文字色を同色）
- ページ全体は公式の丁寧な文体。ファンサイトのような顔文字や砕けた表現はなし

---

### 3. キャラクター一覧（characters/index.html）

**ページタイトル：** キャラクター紹介

**構成：**
```
■ キャラクター紹介

木漏れ日遊園地のなかまたちを紹介します！

┌────────┬────────┐
│[キツネ団長]│[かあ博士]  │
│サムネイル  │サムネイル  │
│キツネ団長  │かあ博士    │
│→詳しく見る │→詳しく見る │
├────────┼────────┤
│[ぽたまる]  │[うっきち]  │
│サムネイル  │サムネイル  │
│ぽたまる    │うっきち    │
│→詳しく見る │→詳しく見る │
└────────┴────────┘
```

**テキスト内容：**

```
■ キャラクター紹介

「木漏れ日遊園地」のなかまたちを紹介します！
名前をクリックすると詳しいプロフィールが見られるよ。

[キツネ団長サムネイル]
キツネ団長
遊園地のリーダー！みんなを楽しませるのが大好き。
→ 詳しく見る

[かあ博士サムネイル]
かあ博士
なんでも知ってる物知り博士。
→ 詳しく見る

[ぽたまるサムネイル]
ぽたまる
ダンスが得意なまんまるのなかま！
→ 詳しく見る

[うっきちサムネイル]
うっきち
みんなを笑顔にするムードメーカー。
→ 詳しく見る
```

**実装注意：**
- **4体のみ。試作きつねはこのページに存在しない**
- 「5体目がいない」こと自体が伏線
- サムネイルは2×2のグリッド配置
- 各サムネイルから詳細ページへリンク
- サムネイル画像はプレースホルダー（キャラの色＋名前テキスト）

---

### 4. キツネ団長 詳細（characters/kitsune.html）

**テキスト内容：**

```
■ キツネ団長

[キツネ団長 全身画像]

━━━━━ プロフィール ━━━━━

名前：キツネ団長
役割：遊園地のリーダー・番組の司会
特徴：オレンジ色の体毛、帽子とマント、懐中時計

━━━━━ 紹介 ━━━━━

木漏れ日遊園地のリーダー、キツネ団長！
帽子とマントがトレードマークの元気いっぱいなキツネです。

いつも持っている懐中時計で時間を管理するのが大好き。
「時間だぞー！」のかけ声で番組を進行していきます。

━━━━━ 得意なこと ━━━━━

・みんなをまとめること
・冒険の計画を立てること
・時間管理（懐中時計がお気に入り）

━━━━━ 出演コーナー ━━━━━

・キツネ団長の冒険タイム（メイン）
・オープニング＆エンディング
・みんなであそぼう！

→ キャラクター一覧に戻る
```

---

### 5. かあ博士 詳細（characters/kaa.html）

**テキスト内容：**

```
■ かあ博士

[かあ博士 全身画像]

━━━━━ プロフィール ━━━━━

名前：かあ博士
役割：物知り担当
特徴：黒い羽毛、白衣、丸い眼鏡

━━━━━ 紹介 ━━━━━

木漏れ日遊園地の物知り博士、かあ博士！
白衣と丸い眼鏡がチャームポイントの博識なカラスです。

子どもたちの「なぜ？」「どうして？」に何でも答えてくれます。
ちょっと早口になることがあるけれど、それは夢中になっている証拠です。

━━━━━ 得意なこと ━━━━━

・何でも知っていること
・実験
・難しいことをわかりやすく説明すること

━━━━━ 出演コーナー ━━━━━

・かあ博士のなぜなぜ教室（メイン）
・キツネ団長の冒険タイム（解説役）

→ キャラクター一覧に戻る
```

---

### 6. ぽたまる 詳細（characters/potamaru.html）

**テキスト内容：**

```
■ ぽたまる

[ぽたまる 全身画像]

━━━━━ プロフィール ━━━━━

名前：ぽたまる
役割：ダンス担当
特徴：まんまるな体、茶色と白のツートンカラー、おなかに太鼓

━━━━━ 紹介 ━━━━━

木漏れ日遊園地のダンサー、ぽたまる！
まんまるでずんぐりした体がかわいい、みんなの人気者です。

おなかについた太鼓をポンポン叩きながら楽しいダンスを披露します。
ダンスの曲には2つのパターンがあって、テンポの違いで踊り方が変わります。

━━━━━ 得意なこと ━━━━━

・ダンス（おなかの太鼓がリズムを刻む！）
・みんなを元気にすること
・食べること（おやつが大好き）

━━━━━ 出演コーナー ━━━━━

・ぽたまるダンス♪（メイン）
・みんなであそぼう！

→ キャラクター一覧に戻る
```

---

### 7. うっきち 詳細（characters/ukkichi.html）★Night2入口

**テキスト内容：**

```
■ うっきち

[うっきち 全身画像] ← ★ここがNight2入口

━━━━━ プロフィール ━━━━━

名前：うっきち
役割：ムードメーカー
特徴：明るい茶色の体毛、長い尻尾、ぼさぼさの髪

━━━━━ 紹介 ━━━━━

木漏れ日遊園地のムードメーカー、うっきち！
いたずら好きだけど憎めない、元気いっぱいのおサルです。

長い尻尾とぼさぼさの髪がチャームポイント。
いつもみんなを笑わせようとするけれど、
最後は自分がひどい目にあうことも…？

━━━━━ 得意なこと ━━━━━

・いたずら（でも最後は失敗する）
・みんなを笑顔にすること
・木登り

━━━━━ 出演コーナー ━━━━━

・うっきちのいたずら大作戦（メイン）
・みんなであそぼう！

→ キャラクター一覧に戻る
```

**★Night2入口の実装：**

うっきちの全身画像に特殊なホバーギミックを実装する。

```html
<div class="ukkichi-image-container" id="ukkichi-secret">
  <!-- 通常画像 -->
  <div class="normal placeholder-character" style="background-color: #b5651d; width: 300px; height: 400px;">
    <span style="color: #fff; font-size: 14px;">うっきち</span>
  </div>
  <!-- ホバー時画像：うっきちの表情が変化する -->
  <div class="hover-image placeholder-character" style="background-color: #8b4513; width: 300px; height: 400px; border: 2px solid #ff0000;">
    <span style="color: #ff0000; font-size: 14px;">うっきち…？</span>
  </div>
</div>
```

```javascript
// Night2入口のギミック
// ホバーで画像が変化 → クリックでNight2へ
const ukkichiContainer = document.getElementById('ukkichi-secret');

ukkichiContainer.addEventListener('click', function() {
    // ホバー状態（変化した画像が表示されている時）のクリックのみ反応
    if (this.matches(':hover')) {
        // Night2への遷移
        window.location.href = '/game/night2.html';
    }
});
```

**Night2入口の仕様：**
1. 通常時：普通のうっきち画像が表示されている
2. マウスホバー時：画像が変化する（色が暗くなる、表情が変わる、赤い枠が出る等）
3. 変化した状態でクリック → Night2のゲームページに遷移
4. 変化は微妙すぎず、はっきりわかる程度にする（プレイヤーが「あれ？」と思うレベル）
5. ホバーを外すと元に戻る
6. モバイル対応：タップで変化→再タップで遷移（またはロングタップ）

---

### 8. スタッフ紹介（staff.html）★ロア

**ページタイトル：** スタッフ紹介

**テキスト内容：**

```
■ スタッフ紹介

「木漏れ日遊園地」の制作スタッフをご紹介します。

━━━━━ 制作スタッフ ━━━━━

番組企画・監修：██████████
プロデューサー：山本 修三
ディレクター：佐藤 真一
脚本：田中 恵子 / 小林 達也
人形デザイン：██████████
人形操演：鈴木 和夫 / 高橋 みどり / 渡辺 健太
音楽：中村 由紀
美術：吉田 一郎
技術：松本 幸男
制作：株式会社ゆめスタジオプロダクション
放送：きらら放送

━━━━━━━━━━━━━━━━

◆ プロデューサー 山本 修三
「子どもたちに本当に楽しいと思ってもらえる番組を目指しています。
スタジオに来てくれた子どもたちの笑顔が一番の励みです。」

◆ ディレクター 佐藤 真一
「毎週の放送を作るのは大変ですが、キャラクターたちに命を吹き込む
この仕事が大好きです。」

◆ 脚本 田中 恵子
「子どもたちが夢中になれるお話を書くことを心がけています。
キツネ団長の冒険は、私自身も毎回ワクワクしながら書いています。」
```

**実装の超重要ポイント：**

#### 塗りつぶしの実装

「番組企画・監修」と「人形デザイン」の2箇所が塗りつぶされている。

```html
<tr>
  <td>番組企画・監修</td>
  <td><span class="redacted" title="">██████████</span></td>
</tr>
```

```css
.redacted {
    background-color: #1a1a1a;
    color: #1a1a1a;
    padding: 1px 4px;
    border-radius: 1px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    cursor: default;
    /* マウス選択しても読めない */
    /* ソースコードを見ても「██████████」しか見えない */
}
```

**重要：**
- 塗りつぶしの下に本当の名前は入れない。HTMLソースにも「██████████」としか書かない
- title属性も空にする
- **「番組企画・監修」と「人形デザイン」が同一人物であることは、ここでは示唆しない**。ただし両方が塗りつぶされていることで、プレイヤーが同一人物を推測できる余地は残す
- 他のスタッフ名は普通に表示されている中で、この2箇所だけが異常

---

### 9. 放送リスト（episodes.html）

**ページタイトル：** 放送リスト

**テキスト内容：**

```
■ 放送リスト

「木漏れ日遊園地」全放送回の一覧です。

━━━━━ 1991年度 ━━━━━

話数    放送日        サブタイトル
#001    1991.04.06    ようこそ木漏れ日遊園地へ！
#002    1991.04.13    キツネ団長の大冒険
#003    1991.04.20    かあ博士の発明品
#004    1991.04.27    ぽたまるダンス初披露！
#005    1991.05.04    うっきちのいたずら
（中略）

━━━━━ 1997年度 ━━━━━

（中略）
#312    1997.09.06    みんなの思い出アルバム
#313    1997.09.13    キツネ団長の約束
#314    1997.09.20    もうすぐ秋だね
#315    1997.09.27    ──

※#315は放送されておりません。
```

**実装注意：**
- ファンサイトの放送リストとは異なり、こちらは公式版。体裁が整っている
- 全315話のリストをHTMLテーブルで表示
- 各話にはdata属性で話数・日付・サブタイトルを埋め込む

```html
<tr data-episode="315" data-date="1997-09-27" data-title="">
  <td>#315</td>
  <td>1997.09.27</td>
  <td>──</td>
</tr>
```

- **Night4の謎解きで使う**：画像ファイル名に含まれる数字→放送リストの話数→日付の照合、という流れ
- そのため、放送リストのデータ構造は正確に実装する
- 中間の話のサブタイトルは適宜生成してよい（番組の内容に合った子ども番組らしいタイトル）
- **特定の話数に、後のNight4謎解きで重要になるサブタイトルを仕込んでおく**（具体的な内容はNight4入口の設計が確定してから差し替え）

---

### 10. お問い合わせフォーム（contact.html）

**ページタイトル：** お問い合わせ

**テキスト内容：**

```
■ お問い合わせ

番組に関するお問い合わせは、下記のフォームよりお送りください。

━━━━━━━━━━━━━━━━

お名前：[          ]

ご連絡先（メール）：[          ]

お問い合わせ種別：
○ 番組について
○ 収録参加について
○ その他

お問い合わせ内容：
[                    ]
[                    ]
[                    ]

[送信する]

━━━━━━━━━━━━━━━━

※お返事までに1〜2週間程度お時間をいただくことがございます。
※いただいた個人情報は、お問い合わせへの対応以外の目的では使用いたしません。
```

**実装注意：**
- フォームは見た目だけ。Night1後の段階では送信しても何も起きない
- 「送信する」ボタンを押すと「現在お問い合わせは受け付けておりません」的なメッセージを表示
- **Night5の入口として使う予定**。Night4クリア後にこのフォームが「生きる」
- Night5の仕様：おかしな文から導いた情報をフォームに正しく入力するとNight5に遷移
- そのため、フォームのHTML構造は以下をしっかり作っておく：

```html
<form id="contact-form" onsubmit="return handleContactSubmit(event)">
  <div class="form-group">
    <label for="name">お名前：</label>
    <input type="text" id="name" name="name">
  </div>
  <div class="form-group">
    <label for="email">ご連絡先（メール）：</label>
    <input type="email" id="email" name="email">
  </div>
  <div class="form-group">
    <label>お問い合わせ種別：</label>
    <label><input type="radio" name="type" value="program"> 番組について</label>
    <label><input type="radio" name="type" value="recording"> 収録参加について</label>
    <label><input type="radio" name="type" value="other"> その他</label>
  </div>
  <div class="form-group">
    <label for="message">お問い合わせ内容：</label>
    <textarea id="message" name="message" rows="5"></textarea>
  </div>
  <button type="submit">送信する</button>
</form>

<script>
function handleContactSubmit(event) {
    event.preventDefault();
    
    // Night5入口チェック（Night4クリア後に有効化）
    // 初期状態では単にメッセージを表示
    const resultDiv = document.getElementById('form-result');
    resultDiv.textContent = '申し訳ございません。現在お問い合わせは受け付けておりません。';
    resultDiv.style.display = 'block';
    
    return false;
}
</script>
```

---

## 共通実装事項

### ナビゲーション（全ページ共通）

```html
<nav class="official-nav">
  <a href="/official/index.html">トップ</a> |
  <a href="/official/about.html">番組紹介</a> |
  <a href="/official/characters/index.html">キャラクター</a> |
  <a href="/official/staff.html">スタッフ</a> |
  <a href="/official/episodes.html">放送リスト</a> |
  <a href="/official/contact.html">お問い合わせ</a>
</nav>
```

### フッター（全ページ共通）

```html
<footer class="official-footer">
  <p>「木漏れ日遊園地」</p>
  <p>制作：株式会社ゆめスタジオプロダクション</p>
  <p>放送：きらら放送</p>
  <p>© YUME STUDIO PRODUCTION / KIRARA BROADCASTING</p>
</footer>
```

### ゲーム進行フラグとの連携

公式アーカイブはNight1クリア後に初めてアクセス可能になる。
フラグ管理の仕組み：

```javascript
// localStorage でゲーム進行状況を管理
// Night1クリア時に設定されるフラグ
// if (localStorage.getItem('night1_clear') !== 'true') {
//     // 公式アーカイブにアクセスできない
//     // リダイレクトまたはエラーページ表示
// }

// Night2クリア後に追加ページが解放される
// Night3〜5も同様

// 各ページはロード時にフラグをチェックし、
// 適切な状態で表示する
```

**注意：** 実際のフラグ管理方法は既存のゲームコード（Night1〜5）に合わせる。localStorageを使っているならそれに合わせる。

---

## プレースホルダー画像一覧

全画像はCSSで仮実装：

```css
/* 各キャラクターのプレースホルダー */
.char-placeholder {
    display: inline-block;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
    padding-top: 40%;
    font-size: 14px;
    color: #666;
    position: relative;
}

.char-kitsune { background-color: #ff8c00; width: 200px; height: 250px; }
.char-kaa { background-color: #333333; width: 200px; height: 250px; color: #fff; }
.char-potamaru { background-color: #d2b48c; width: 200px; height: 250px; }
.char-ukkichi { background-color: #b5651d; width: 200px; height: 250px; }

/* ロゴのプレースホルダー */
.logo-placeholder {
    background-color: #4a8c3f;
    color: #fff;
    padding: 20px 40px;
    font-size: 28px;
    font-weight: bold;
    display: inline-block;
    border-radius: 8px;
    cursor: pointer;
}
```

---

## ファンサイトとの差異チェックリスト

| 項目 | ファンサイト | 公式アーカイブ |
|------|-------------|---------------|
| フォント | MSゴシック | ヒラギノ/メイリオ系 |
| 配色 | パステルグリーン・クリーム | 落ち着いた深緑・白 |
| レイアウト | 2カラム・テーブル風 | 1カラム・整然 |
| 文体 | 顔文字・砕けた口調 | 公式・丁寧語 |
| 幅 | 780px固定 | 900px固定 |
| 雰囲気 | 温かい・手作り | 整った・公式 |
| 怖さ | なし（スレッド4除く） | 微妙な違和感（塗りつぶし等） |

---

## テスト項目

- [ ] 全10ページが正しく表示される
- [ ] ナビゲーションが全ページで機能する
- [ ] **スタッフ紹介の塗りつぶし（2箇所）が読めない**
- [ ] **塗りつぶしをマウス選択しても内容が見えない**
- [ ] **キャラクター一覧に試作きつねがいない（4体のみ）**
- [ ] **うっきちページのホバーで画像が変化する**
- [ ] **変化した画像をクリックするとNight2ページに遷移する**
- [ ] 放送リストの#315が「──」で「放送されておりません」
- [ ] お問い合わせフォームが現段階では送信不可
- [ ] トップページのロゴにクリックイベントの仕組みが準備されている
- [ ] フッターに著作権表記がある
- [ ] ファンサイトとデザインが明確に異なる
- [ ] 全体的に2000年代の公式番組サイトの雰囲気が出ている
- [ ] おしらせが1997年で止まっている
