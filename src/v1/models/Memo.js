const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// メモのモデル（DB）スキーマ
const memoSchema = new Schema({
  // 外部キーみたいなもの↓
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  icon: {
    type: String,
    default: "🗒",
  },
  title: {
    type: String,
    default: "無題",
  },
  description: {
    type: String,
    default: "ここに自由に記入してください",
  },
  position: {
    type: Number,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  favoritePosition: {
    type: Number,
    default: 0,
  },
});

// 別ファイルでも使えるように呼び出せる準備
module.exports = mongoose.model("Memo", memoSchema);
