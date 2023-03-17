// ユーザーに関するコントローラーファイル

// パスワード暗号化
const CryptoJS = require("crypto-js");

// json web token呼ぶ
const JWT = require("jsonwebtoken");

const User = require("../models/User");

exports.register = async (req, res) => {
  //パスワード受け取り
  const password = req.body.password;

  try {
    // パスワードの暗号化
    req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY);
    // ユーザーの新規作成
    const user = await User.create(req.body);
    // JWTの発行
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      // 24時間有効なトークン
      expiresIn: "24h",
    });
    // ユーザーとトークンの情報をクライアントに返す
    return res.status(200).json({ user, token });
  } catch (err) {
    // エラーが起きた（tryが実行できなかった）
    return res.status(500).json(err);
  }
};

// ユーザーログイン用API
exports.login = async (req, res) => {
  // 分割代入
  const { username, password } = req.body;

  try {
    // DBからユーザーが存在するか探してくる
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({
        errors: [{ param: "username", msg: "ユーザー名が無効です" }],
      });
    }

    // user名があってたらパスワードがあっているか照合する 暗号化させたパスを探してくる
    const descryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
      // 文字列にしてあげる
    ).toString(CryptoJS.enc.Utf8);
    // もし登録したパスワードが記入したパスワードと一致しなければ注意文を出す
    if (descryptedPassword !== password) {
      return res.status(401).json({
        errors: [
          {
            param: "password",
            msg: "パスワードが無効です",
          },
        ],
      });
    }
    // 一致したらJWTを発行
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      // 24時間有効なトークン
      expiresIn: "24h",
    });
    return res.status(201).json({ user, token });
  } catch (err) {
    return res.status(500).json(err);
  }
};
