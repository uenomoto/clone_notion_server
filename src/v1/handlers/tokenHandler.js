const JWT = require("jsonwebtoken");
const User = require("../models/User");

// クライアントから渡されたJWTが正常か検証

const tokenDecode = (req) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    // トークンだけ取得↓
    const bearer = bearerHeader.split(" ")[1];
    try {
      // トークン確認
      const decodedToken = JWT.verify(bearer, process.env.TOKEN_SECRET_KEY);
      // トークンが使えたらつまり24時間以内ならログインなしで入れるよ
      return decodedToken;
    } catch (err) {
      // 24時間過ぎてたら期限切れだよまたログインしてもらってね
      return false;
    }
  } else {
    // そもそもトークンがなかったらサインアップしてね
    return false;
  }
};

// JWT認証を検証するためのミドルウェア（トークン版バリデーションチェック）

exports.verifyToken = async (req, res, next) => {
  // 上で定義した正常だったJWTをリクエストされてる
  const tokenDecoded = tokenDecode(req);
  // もしトークンが使えたら
  if (tokenDecode) {
    // そのJWTと一致するユーザーを探してくる　user_id
    const user = await User.findById(tokenDecoded.id);

    // user_idが一致しなかったらお帰りください。
    if (!user) {
      return res.status(401).json("権限がありません");
    }
    // 一致したら次へ
    req.user = user;
    next();
  } else {
    // そもそもトークンがなかったら
    return res.status(401).json("権限がありません");
  }
};
