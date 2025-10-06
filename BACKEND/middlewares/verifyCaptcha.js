const axios = require("axios");

const verifyCaptcha = async (req, res, next) => {
  try {
    const { captcha } = req.body;
    if (!captcha) {
      return res.status(400).json({ msg: "Captcha is required" });
    }

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECATPCHA_SECRET_KEY}&response=${captcha}`
    );

    if (!response.data.success) {
      return res.status(400).json({ msg: "Captcha verification failed" });
    }

    next();
  } catch (error) {
    res.status(500).json({ msg: "Captcha verification error", error: error.message });
  }
};

module.exports = verifyCaptcha;