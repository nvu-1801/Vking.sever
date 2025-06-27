// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { verifyAdmin } = require("../middlewares/auth");

router.patch("/make-admin/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true });
    res.json({ message: "Cập nhật quyền admin thành công", user });
  } catch (err) {
    res.status(500).json({ message: "Có lỗi xảy ra" });
  }
});

module.exports = router;
