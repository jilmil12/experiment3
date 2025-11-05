import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import bcrypt from "bcrypt";
import db from "./db.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// Default route
app.get("/", (req, res) => {
  res.sendFile("login.html", { root: "public" });
});

// Handle login form submission
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.send("<h2>Server error. Please try again.</h2>");
    }

    if (results.length === 0) {
      return res.send("<h2>User not found. Please register first.</h2>");
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.user = user;
      res.redirect("/dashboard");
    } else {
      res.send("<h2>Incorrect password. Please try again.</h2>");
    }
  });
});

// Protected route
app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.sendFile("dashboard.html", { root: "public" });
  } else {
    res.redirect("/");
  }
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
