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
