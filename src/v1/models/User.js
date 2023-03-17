const mongoose = require("mongoose");

// ユーザーのモデル（DB）スキーマ
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

// 別ファイルでも使えるように呼び出せる準備
module.exports = mongoose.model("User", userSchema);
