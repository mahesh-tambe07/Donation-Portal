const express = require("express");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
const port = 5000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database.");
});

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to create an order
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    // Creating Razorpay order
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        key1: "value1",
        key2: "value2",
      },
    };

    const order = await razorpay.orders.create(options);
    res.json(order); // Send order details back to frontend
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Route to save donation details to database
app.post("/save-donation", (req, res) => {
  const { name, email, amount, payment_id } = req.body;

  const query = "INSERT INTO donations (name, email, amount, payment_id) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, amount, payment_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }
    res.status(200).send("Donation saved successfully");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
