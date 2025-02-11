const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose
  .connect(
    `mongodb+srv://${username}:${password}@raise-hub.g2uh1dk.mongodb.net/RaiseHub`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  number: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  wallet: { type: Number, default: 0 },
  transactions: [
    {
      foundationName: String,
      cause: String,
      description: String,
      location: String,
      amount: Number,
      date: { type: Date, default: Date.now },
    },
  ],
  deposits: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

const foundationSchema = new mongoose.Schema({
  foundationName: String,
  cause: String,
  description: String,
  location: String,
  fundsRaised: { type: Number, default: 0 },
  contactDetails: Number,
  validateFoundation: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);
const FoundationRequest = mongoose.model("FoundationRequest", foundationSchema);

// Routes
app.get("/signout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
});
app.get("/foundationRequest", (req, res) => {
  res.sendFile(__dirname + "/public/FoundationRequest.html");
});
app.post("/foundationRequest", async (req, res) => {
  const newRequest = new FoundationRequest({
    foundationName: req.body.foundationName,
    cause: req.body.cause,
    description: req.body.description,
    location: req.body.location,
    contactDetails: req.body.contactDetails,
  });

  try {
    await newRequest.save();
    res.redirect("/");
  } catch (err) {
    res.send(err);
  }
});
app.get("/admin", async (req, res) => {
  try {
    const foundations = await FoundationRequest.find({ validateFoundation: 1 });
    const requests = await FoundationRequest.find({ validateFoundation: 0 });
    const rejected = await FoundationRequest.find({ validateFoundation: -1 });
    res.render("adminDashboard", { foundations, requests, rejected });
  } catch (err) {
    res.send(err);
  }
});
app.post("/admin/approveFoundation", async (req, res) => {
  try {
    await FoundationRequest.findByIdAndUpdate(req.body.foundationId, {
      validateFoundation: 1,
    });
    res.redirect("/admin");
  } catch (err) {
    res.send(err);
  }
});
app.post("/admin/rejectFoundation", async (req, res) => {
  try {
    await FoundationRequest.findByIdAndUpdate(req.body.foundationId, {
      validateFoundation: -1,
    });
    res.redirect("/admin");
  } catch (err) {
    res.send(err);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "LoginSignin.html"));
});

app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "LoginSignin.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "LoginSignin.html"));
});

app.post("/login", async (req, res) => {
  const { number, password } = req.body;

  try {
    if (number === "1111" && password === "1111") {
      // Admin login
      req.session.userLoggedIn = true;
      req.session.userNumber = number;
      return res.redirect("/admin"); // Redirect to admin dashboard
    }

    const loggedInUser = await User.findOne({ number: number });

    if (loggedInUser) {
      const passwordMatch = await bcrypt.compare(
        password,
        loggedInUser.password
      );

      if (passwordMatch) {
        // Regular user login
        req.session.userLoggedIn = true;
        req.session.userNumber = number;
        return res.redirect("/success");
      }
    }

    // If no conditions matched, send an error message
    res.send(
      "Invalid phone number or password. Please try again. <a href='/'>Go back</a>"
    );
  } catch (err) {
    console.error("Error during login:", err.message);
    res.send(
      "An unexpected error occurred. Please try again later. <a href='/'>Go back</a>"
    );
  }
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, number, password } = req.body;

  try {
    const existingUser = await User.findOne({ number: number });

    if (existingUser) {
      res.send(
        "<script>alert('Phone number already exists. Please choose a different phone number.'); window.location.href = '/signup';</script>"
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        number,
        password: hashedPassword,
      });

      await newUser.save();
      res.redirect("/");
    }
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.send(
      "<script>alert('An unexpected error occurred. Please try again later.'); window.location.href = '/signup';</script>"
    );
  }
});

app.get("/success", async (req, res) => {
  if (req.session.userLoggedIn) {
    const userNumber = req.session.userNumber;
    try {
      const foundations = await FoundationRequest.find({
        validateFoundation: 1,
      });
      const user = await User.findOne({ number: userNumber });

      res.render("userDashboard", { foundations, user });
    } catch (err) {
      console.error("Error fetching data:", err);
      res.send("An error occurred. Please try again later.");
    }
  } else {
    res.redirect("/");
  }
});

app.post("/donate", async (req, res) => {
  const { foundationName, amount } = req.body;
  const userNumber = req.session.userNumber; // Get user number from session

  try {
    // Find the foundation by its name
    const foundation = await FoundationRequest.findOne({ foundationName });

    if (!foundation) {
      return res.status(404).send("Foundation not found");
    }

    // Find the user by number
    const user = await User.findOne({ number: userNumber });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the user has enough balance in the wallet
    if (user.wallet < amount) {
      return res.status(403).send("Insufficient funds in wallet");
    }

    // Update the funds raised for the foundation
    foundation.fundsRaised += parseInt(amount);

    // Deduct the donation amount from the user's wallet
    user.wallet -= parseInt(amount);

    // Add the transaction to the user's history
    user.transactions.push({
      foundationName: foundation.foundationName,
      cause: foundation.cause,
      description: foundation.description,
      location: foundation.location,
      amount: parseInt(amount),
    });

    // Save the updated foundation and user
    await foundation.save();
    await user.save();

    // Send a thank you message with the updated funds raised
    res.redirect("/success");
  } catch (err) {
    console.error("Error processing donation:", err);
    res.status(500).send("An error occurred while processing your donation");
  }
});

app.post("/addMoney", async (req, res) => {
    const { amount } = req.body;
    const userNumber = req.session.userNumber; // Get user number from session
  
    try {
      const user = await User.findOne({ number: userNumber });
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      // Add the amount to the user's wallet
      user.wallet += parseInt(amount);
  
      // Record the deposit transaction
      user.deposits.push({ amount: parseInt(amount) });
  
      // Save the updated user
      await user.save();
  
      res.redirect("/success");
    } catch (err) {
      console.error("Error adding money to wallet:", err);
      res.status(500).send("An error occurred while adding money to your wallet");
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
