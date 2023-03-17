// ログイン認証用ファイル(API)

const router = require("express").Router();

const { body } = require("express-validator");

// .envファイル使えるようにする
require("dotenv").config();

// モデル呼び出し
const User = require("../models/User");
// 別ファイルから呼び出し
const validation = require("../handlers/validation");
const userController = require("../controllers/user");
const tokenHandler = require("../handlers/tokenHandler");

// ユーザー新規登録API(サインアップ)
router.post(
  // URL
  "/register",
  // バリデーションチェック
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は８文字以上である必要があります"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは８文字以上である必要があります"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("確認用パスワードは８文字以上である必要があります"),
  // カスタムバリデーション↓同一人物がいないかの確認
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("このユーザーは既に使われています");
      }
    });
  }),
  validation.validate,
  userController.register
);

//ログイン用API(サインイン)
router.post(
  "/login",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は８文字以上である必要があります"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは８文字以上である必要があります"),
  validation.validate,
  userController.login
);

// JWT認証API（ちゃんとトークンを受け取ってから24時間以内なのか確認する）
router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
