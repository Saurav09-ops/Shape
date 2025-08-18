import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 5000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Shape",
  password: "Ghostrider23@#$",
  port: 5432,
});

db.connect();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res, next) => {
  let email = req.body.email.trim();
  let pass = req.body.pass.trim();

  if (!email || !pass) {
    console.log("not right input");
    return res.redirect("/");
  }

  const result = await db.query("SELECT * FROM users where email= $1", [email]);
  const user = result.rows[0];

  if (!user) {
    console.log("email not found");
    return res.redirect("/");
  }

  const isValid = await bcrypt.compare(pass, user.password);
  if (isValid) {
    res.render("home");
  } else {
    console.log("false password");
    res.redirect("/");
  }
});

app.get("/test", (req, res) => {
  res.render("compose");
});

app.post("/signup", async (req, res) => {
  const fName = req.body.fname.trim();
  const lName = req.body.lname.trim();
  const email = req.body.email.trim();
  const hash = await bcrypt.hash(req.body.pass.trim(), 10);
  const sex = req.body.sex;

  await db.query(
    "INSERT INTO users(first_name,last_name,email,password,gender) values($1,$2,$3,$4,$5)",
    [fName, lName, email, hash, sex]
  );
  res.redirect("/");
});

app.listen(port, (req, res) => {
  console.log(`Running on port http://localhost:${port}/`);
});

// const session = require("express-session");
// const flash = require("connect-flash");
// const rateLimit = require("express-rate-limit");

// app.use(session({
//   secret: "your-secret-key",
//   resave: false,
//   saveUninitialized: false
// }));

// app.use(flash());

// app.use((req, res, next) => {
//   res.locals.flash = req.flash();
//   next();
// });

// // Optional rate limiter for login route
// const loginLimiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 5,
//   message: "Too many login attempts. Try again later."
// });

// app.post("/login", loginLimiter, async (req, res, next) => {
//   try {
//     const email = req.body.email?.trim();
//     const pass = req.body.pass?.trim();

//     // Input validation
//     if (!email || !pass) {
//       req.flash("error", "Email and password are required.");
//       return res.redirect("/");
//     }

//     // Fetch user by email only
//     const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
//     const user = result.rows[0];

//     if (!user) {
//       req.flash("error", "Invalid email or password.");
//       return res.redirect("/");
//     }

//     // Password comparison
//     const isValid = await bcrypt.compare(pass, user.password);
//     if (!isValid) {
//       req.flash("error", "Invalid email or password.");
//       return res.redirect("/");
//     }

//     // Set session (example: store user ID)
//     req.session.userId = user.id;
//     req.flash("success", "Login successful!");
//     return res.redirect("/home");

//   } catch (err) {
//     console.error("Login error:", err.message);
//     req.flash("error", "Something went wrong. Please try again later.");
//     return res.redirect("/");
//   }
// });
