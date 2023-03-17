// エクスプレスフレームワークつかえるようにする
const express = require("express");
const app = express();
const PORT = 5050;
// .envファイル使えるようにする
require("dotenv").config();
// クロスポリシーエラー回避に使用
const cors = require("cors");

app.use(
  cors({
    // ポート番号３０００番を許可する↓
    origin: "http://localhost:3000",
  })
);

// ポストマンをjson形式でできる
app.use(express.json());

// DB↓
const connectDB = require("./src/v1/db/connect");

app.use("/api/v1", require("./src/v1/routes"));

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, console.log("サーバーが起動中..."));
  } catch (err) {
    console.log(err);
  }
};
start();
