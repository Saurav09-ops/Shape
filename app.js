import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import { Strategy } from "passport-local";
import env from "dotenv";
import passport from "passport";
import flash from "connect-flash";

const app = express();
const port = 5000;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

app.get("/", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true,
  })
);

app.post("/signup", async (req, res) => {
  const fName = req.body.fname.trim();
  const lName = req.body.lname.trim();
  const email = req.body.email.trim();
  const hash = await bcrypt.hash(req.body.pass.trim(), 10);
  const sex = req.body.sex;

  try {
    const result = await db.query("SELECT * FROM users where email= $1", [
      email,
    ]);
    const user = result.rows[0];

    if (user) {
      console.log("email exist already");
      return res.redirect("/");
    }

    await db.query(
      "INSERT INTO users(first_name,last_name,email,password,gender) values($1,$2,$3,$4,$5)",
      [fName, lName, email, hash, sex]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/home", isAuthenticated, async (req, res) => {
  let result = await db.query(
    "SELECT users.id, users.first_name,users.last_name,posts.title,posts.detail,posts.created_at FROM users INNER JOIN posts ON users.id = posts.user_id ORDER BY created_at DESC"
  );
  let posts = result.rows;

  res.render("home", { posts: posts });
});

app.get("/compose", isAuthenticated, (req, res) => {
  res.render("compose");
});

app.post("/compose", isAuthenticated, async (req, res) => {
  const user = req.user;
  const title = req.body.title.trim();
  const detail = req.body.detail.trim();
  const id = user.id;

  await db.query("INSERT INTO posts(title,detail,user_id) values($1,$2,$3)", [
    title,
    detail,
    id,
  ]);

  res.redirect("/compose");
});

app.get("/profile", isAuthenticated, async (req, res) => {
  const user = req.user;
  const result = await db.query(
    "Select * FROM posts WHERE user_id=$1 ORDER BY created_at DESC",
    [user.id]
  );
  const posts = result.rows;
  const profileUser = req.user;

  res.render("profile", {
    posts: posts,
    profileUser: profileUser,
    currentUser: user,
  });
});

app.get("/profile/:id", isAuthenticated, async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  try {
    const userResult = await db.query("Select * FROM users WHERE id=$1 ", [id]);
    const profileUser = userResult.rows[0];
    if (!profileUser) {
      return res.redirect("/home");
    }

    const postResult = await db.query(
      "Select * FROM posts WHERE user_id=$1 ORDER BY created_at DESC",
      [id]
    );

    const posts = postResult.rows;

    res.render("profile", {
      posts: posts,
      profileUser: profileUser,
      currentUser: user,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete/:id", isAuthenticated, async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  await db.query(`DELETE FROM posts WHERE id=$1 And user_id=$2`, [id, user.id]);
  res.redirect("/profile");
});

app.post("/update/:id", isAuthenticated, async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const detail = req.body.detail.trim();
  await db.query(`UPDATE posts SET detail=$1 WHERE id=$2  And user_id=$3`, [
    detail,
    id,
    user.id,
  ]);
  res.redirect("/profile");
});

passport.use(
  new Strategy({ usernameField: "email" }, async function verify(
    email,
    password,
    cb
  ) {
    try {
      if (!email || !password) {
        return cb(null, false, { message: "Missing credentials" });
      }

      const result = await db.query("SELECT * FROM users where email= $1", [
        email,
      ]);
      const user = result.rows[0];

      if (!user) {
        return cb(null, false, { message: "Email not found" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return cb(null, false, { message: "Incorrect password" });
      } else {
        return cb(null, user);
      }
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, (req, res) => {
  console.log(`Running on port http://localhost:${port}/`);
});
