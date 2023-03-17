const router = require("express").Router();

// 今回は
// http://localhost:5050/api/v1/auth/registerを叩ける（サインアップ画面）

router.use("/auth", require("./auth"));
router.use("/memo", require("./memo"));

module.exports = router;
