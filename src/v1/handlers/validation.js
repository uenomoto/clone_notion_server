// バリデーションファイル

// バリデーションのライブラリ呼び出し
const { validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  // もしエラーが空じゃなかったら実行
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
