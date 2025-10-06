const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectDB = require('./db/connection');
const authRoutes = require('./Routes/auth');
const contactRoutes= require('./Routes/contact')
const guidanceRoutes = require("./Routes/guidence");
const hosipitalmatching=require("./Routes/hosipitalmatching")
const bloodRequestRoutes = require("./Routes/bloodrequest");
const notificationRoutes = require('./Routes/notification');
const forgetPassword=require('./Routes/forgetpassword')
const payment=require("./Routes/payment")
const donorRoutes = require("./Routes/donar");
const passport = require("passport");
require("./config/passport");

const PORT = process.env.PORT || 8000;
connectDB();

app.use(morgan('dev'));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes)
app.use("/api/guidance", guidanceRoutes)
app.use('/auth', authRoutes);
app.use("/api/places", hosipitalmatching);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/donors", donorRoutes);
app.use('/api/payment', payment)
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth',forgetPassword)


app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
