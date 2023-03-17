const Memo = require("../models/Memo");

exports.create = async (req, res) => {
  try {
    // ↓意味は今あるメモの数を取得できる
    const memoCount = await Memo.find().count();
    // メモ新規作成
    const memo = await Memo.create({
      user: req.user._id,
      position: memoCount > 0 ? memoCount : 0,
    });
    res.status(201).json(memo);
  } catch (err) {
    res.status(500).josn(err);
  }
};

exports.getAll = async (req, res) => {
  try {
    // 今現在ログインしてるユーザーのメモを全て取得
    const memos = await Memo.find({ user: req.user._id }).sort("-position");
    res.status(200).json(memos);
  } catch (err) {
    res.status(500).josn(err);
  }
};

exports.getOne = async (req, res) => {
  // memoId取得
  const { memoId } = req.params;
  try {
    // 今現在ログインしてるユーザーのメモを一つを取得
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
    if (!memo) return res.status(404).json("お探しのメモは存在しません。");
    res.status(200).json(memo);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  // memoId取得
  const { memoId } = req.params;
  // 編集するカラムを指定する
  const { title, description } = req.body;

  try {
    // もし値が空だったら以下のデフォルト文字を打ち込む
    if (title === "") req.body.title = "無題";
    if (description === "")
      req.bod.description = "ご自由にメモを書いてください";

    // 今現在ログインしてるユーザーのメモの一つの情報を取得
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
    if (!memo) return res.status(404).json("お探しのメモは存在しません。");
    // 取得した後にメモの情報を編集
    const updatedMemo = await Memo.findByIdAndUpdate(memoId, {
      $set: req.body,
    });

    res.status(200).json(updatedMemo);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 削除コントローラ
exports.delete = async (req, res) => {
  // memoId取得
  const { memoId } = req.params;
  try {
    // 今現在ログインしてるユーザーのメモを一つを取得
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
    if (!memo) return res.status(404).json("お探しのメモは存在しません。");
    // 指定したメモIDを削除
    await Memo.deleteOne({ _id: memoId });
    res.status(200).json("メモを削除しました");
  } catch (err) {
    res.status(500).json(err);
  }
};
