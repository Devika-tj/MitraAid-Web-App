const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { signup, login } = require("../controllers/authcontroller");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const verifyCaptcha = require("../middlewares/verifyCaptcha");
const User = require("../Models/User"); 


// Middleware
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};


// VerifyOtp

router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });

    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });
    if (Date.now() > user.otpExpires) return res.status(400).json({ msg: "OTP expired" });

    user.isPhoneVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ msg: "Verification successful", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// send otp

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/send-otp", async (req, res) => {
  try {
    const { name, email, phone, password, role, place } = req.body;

    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ msg: "Phone already registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins

    // Temporarily store the data + OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const tempUser = new User({ name, email, phone, password: hashedPassword, role, place, otp, otpExpires });
    await tempUser.save();

    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });

    res.json({ msg: "OTP sent successfully", phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error sending OTP" });
  }
});



router.put("/update-profile", verifyToken, async (req, res) => {
  try {
    const { name, phone, place } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, place },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Validation helper
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Signup
router.post(
  "/signup",
  verifyCaptcha,
  validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("phone")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone must be 10 digits"),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must include upper, lower, number, special char"),
  ]),
  signup
);

// Login
router.post(
  "/login",
  verifyCaptcha,
  validate([
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ]),
  login
);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id, role: req.user.role, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
    } catch (error) {
      console.error("Google login error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
    }
  }
);

// Current User
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role avatar");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;


