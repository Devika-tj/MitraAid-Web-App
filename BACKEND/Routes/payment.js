const express=require("express")
const router = express.Router();
const crypto = require("crypto");
const Payment=require("../Models/payment")
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Create order Api

router.post("/order", async (req, res) => {
  try {
    const amount = Number(req.body.amount); // ensure it's numeric

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay Error:", error);
        return res.status(500).json({ message: "Something Went Wrong" });
      }

      console.log("Razorpay Order Created:", order);
      res.status(200).json(order); 
    });
  } catch (error) {
    console.error("Internal Error:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});



// Create Verify Api

router.post('/verify',async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature }=req.body;

    try{
        const sign=razorpay_order_id + "|" + razorpay_payment_id

        const expectedSign=crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex")

        // create isAuthentic
        const isAuthentic=expectedSign === razorpay_signature;

        // Condition

        if (isAuthentic){
            const payment=new Payment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            });

            // Save Payment

            await payment.save();

            // Send Message

            res.json({message: "Payment Successfully"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error!"})
    }
})

// Route

router.get('/get-payment', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});


module.exports=router