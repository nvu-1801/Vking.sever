const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email đã tồn tại' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashed, isAdmin });

  await newUser.save();
  res.status(201).json({ message: 'Đăng ký thành công' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Email không tồn tại' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await user.save();

  res.json({ message: "Đặt lại mật khẩu thành công" });
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email không tồn tại" });

  // Tạo token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 phút

  // Lưu vào DB
  user.resetToken = resetToken;
  user.resetTokenExpires = resetTokenExpires;
  await user.save();

  // Gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const resetUrl = `http://localhost:3000/reset/${resetToken}`; // ⚠️ thay bằng domain client thật

  await transporter.sendMail({
    from: `"PlantLand" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Đặt lại mật khẩu",
    html: `
      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ bạn.</p>
      <p>Click vào liên kết bên dưới để đặt lại mật khẩu:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Liên kết sẽ hết hạn sau 15 phút.</p>
    `,
  });

  res.json({ message: "Đã gửi email đặt lại mật khẩu!" });
};