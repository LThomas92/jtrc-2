const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

require("dotenv").config();

async function seedAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to DB");

    const password = await bcrypt.hash("123456", 10);

   await User.deleteMany({ role: "admin" });

    await User.insertMany([
      {
        name: "Owner 1",
        email: "[email protected]",
        password ,
        role: "admin",
      },
      {
        name: "Owner 2",
        email: "[email protected]",
        password ,
        role: "admin",
      },
    ]);

    console.log("✅ Admin users created");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmins();