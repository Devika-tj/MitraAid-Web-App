const bcrypt = require("bcryptjs");
const User = require("../Models/User");

const Admin = async () => {
  try {
    const adminEmail = "admin@firstaid.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 12);
      const admin = new User({
        name: "Super Admin",
        email: adminEmail,
        phone: "9999999999",
        password: hashedPassword,
        role: "Admin",
      });
      await admin.save();
      console.log("Admin user created:", adminEmail, "password: Admin@123");
    } else {
      console.log("Admin user already exists:", adminEmail);
    }
  } catch (err) {
    console.error("Error seeding admin:", err.message);
  }
};

module.exports = Admin;
