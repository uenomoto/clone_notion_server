// DB接続用ファイル

// マングース使えるように
const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log("DB繋がってる？"))
    .catch((error) => console.log(error));
};

module.exports = connectDB;
