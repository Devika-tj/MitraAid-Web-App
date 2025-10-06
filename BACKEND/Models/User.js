const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true,maxlength: 50, trim: true,},
    email: {type: String,required: true,unique: true,lowercase: true,match: [/^\S+@\S+\.\S+$/, "Invalid email format"],},
    phone: {type: String,match: [/^[0-9]{10}$/, "Phone must be 10 digits"], },
    place: { type: String },
    isPhoneVerified: { type: Boolean, default: true },
    otp: String,
    otpExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    password: {type: String,minlength: 8, required: function () { return !this.googleId }, },
    googleId: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ["User", "Responder", "Donor", "Admin"],
         default: "User", },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
