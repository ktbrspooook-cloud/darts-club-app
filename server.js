const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let matches = [
  { player: "ざっきー", game: "701", score: 85, rating: 13 },
  { player: "クロイワン", game: "Cricket", score: 72, rating: 10 },
  { player: "たけちゃん", game: "501", score: 68, rating: 9 },
];

app.get("/", (req, res) => {
  const rankingRows = matches
    .sort((a, b) => b.rating - a.rating)
    .map(
      (m, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${m.player}</td>
          <td>${m.game}</td>
          <td>${m.score}</td>
          <td>Rt.${m.rating}</td>
        </tr>
      `
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>ダーツ部レーティングアプリ</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <main class="container">
        <section class="hero">
          <p class="badge">Company Darts Club</p>
          <h1>ダーツ部レーティングアプリ</h1>
          <p>試合結果を記録して、部内ランキングをゆるく可視化するアプリです。</p>
        </section>

        <section class="card">
          <h2>試合結果登録</h2>
          <form action="/matches" method="POST">
            <label>
              プレイヤー名
              <input type="text" name="player" placeholder="例：ざっきー" required />
            </label>

            <label>
              ゲーム種別
              <select name="game">
                <option value="701">701</option>
                <option value="501">501</option>
                <option value="Cricket">Cricket</option>
              </select>
            </label>

            <label>
              スコア
              <input type="number" name="score" placeholder="例：80" required />
            </label>

            <label>
              レーティング
              <input type="number" name="rating" placeholder="例：12" required />
            </label>

            <button type="submit">登録する</button>
          </form>
        </section>

        <section class="card">
          <h2>ランキング</h2>
          <table>
            <thead>
              <tr>
                <th>順位</th>
                <th>名前</th>
                <th>ゲーム</th>
                <th>スコア</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              ${rankingRows}
            </tbody>
          </table>
        </section>
      </main>
    </body>
    </html>
  `);
});

app.post("/matches", (req, res) => {
  const { player, game, score, rating } = req.body;

  matches.push({
    player,
    game,
    score: Number(score),
    rating: Number(rating),
  });

  res.redirect("/");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Darts app is running on http://localhost:${PORT}`);
});