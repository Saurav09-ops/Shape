import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import { Strategy } from "passport-local";
import env from "dotenv";
import passport from "passport";
import flash from "connect-flash";
import GoogleStrategy from "passport-google-oauth2";
import cors from "cors";

const app = express();
const port = 5000;
env.config();
app.use(express.static("public"));
// const allowedOrigin = "https://7jctqtj0-5000.inc1.devtunnels.ms"; // or your frontend URL

// app.use(
//   cors({
//     origin: allowedOrigin,
//     credentials: true,
//   })
// );

const db = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  max: 10,
  idleTimeoutMillis: 30000,
});

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
let client = [];
let client2 = [];
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/home",
  passport.authenticate("google", {
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
  let { id: userId } = req.user;

  let picResult = await db.query(
    "select profile_pic_url from users where id=$1",
    [userId]
  );

  let pic = picResult.rows[0];

  let result = await db.query(
    "SELECT posts.id, users.first_name,users.last_name,users.profile_pic_url,posts.user_id,posts.title,posts.detail,posts.created_at,COALESCE(comment.comments,0)as comments,COALESCE(response.likes,0)as likes,COALESCE(response.dislikes,0)as dislikes FROM posts  INNER JOIN users ON users.id= posts.user_id LEFT JOIN(SELECT post_id, COUNT(*) AS comments FROM comment GROUP BY post_id) comment ON posts.id= comment.post_id LEFT JOIN(SELECT post_id,COUNT(CASE WHEN approve=true THEN user_id END)AS likes,COUNT(CASE WHEN approve=false THEN user_id END) AS dislikes FROM response GROUP BY post_id) response ON posts.id= response.post_id ORDER BY created_at DESC"
  );
  let posts = result.rows;

  res.render("home", { posts: posts, userId: userId, pic: pic });
});

app.get("/compose", isAuthenticated, async (req, res) => {
  let { id: userId } = req.user;

  let picResult = await db.query(
    "select profile_pic_url from users where id=$1",
    [userId]
  );

  let pic = picResult.rows[0];
  res.render("compose", { pic: pic });
});

app.get("/reaction", async (req, res) => {
  let result = await db.query("select * from response");
  res.json(result.rows);
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

  try {
    const userResult = await db.query("Select * FROM users WHERE id=$1 ", [
      user.id,
    ]);
    const User = userResult.rows[0];
    if (!User) {
      return res.redirect("/home");
    }
    const result = await db.query(
      `SELECT posts.id, users.first_name,users.last_name,users.profile_pic_url,posts.user_id,posts.title,posts.detail,posts.created_at,COALESCE(comment.comments,0)as comments,COALESCE(response.likes,0)as likes,COALESCE(response.dislikes,0)as dislikes 
      FROM posts  
      INNER JOIN users ON users.id= posts.user_id 
      LEFT JOIN(
      SELECT post_id, COUNT(*) AS comments 
      FROM comment 
      GROUP BY post_id) comment ON posts.id= comment.post_id 
      LEFT JOIN(
      SELECT post_id,
      COUNT(CASE WHEN approve=true THEN user_id END)AS likes,
      COUNT(CASE WHEN approve=false THEN user_id END) AS dislikes 
      FROM response 
      GROUP BY post_id) response ON posts.id= response.post_id 
      WHERE posts.user_id=$1
      ORDER BY created_at DESC`,
      [user.id]
    );
    const posts = result.rows;
    const profileUser = User;

    res.render("profile", {
      posts: posts,
      profileUser: profileUser,
      currentUser: User,
    });
  } catch (err) {
    console.log(err);
  }
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
      `SELECT posts.id, users.first_name,users.last_name,users.profile_pic_url,posts.user_id,posts.title,posts.detail,posts.created_at,COALESCE(comment.comments,0)as comments,COALESCE(response.likes,0)as likes,COALESCE(response.dislikes,0)as dislikes 
      FROM posts  
      INNER JOIN users ON users.id= posts.user_id 
      LEFT JOIN(
      SELECT post_id, COUNT(*) AS comments 
      FROM comment 
      GROUP BY post_id) comment ON posts.id= comment.post_id 
      LEFT JOIN(
      SELECT post_id,
      COUNT(CASE WHEN approve=true THEN user_id END)AS likes,
      COUNT(CASE WHEN approve=false THEN user_id END) AS dislikes 
      FROM response 
      GROUP BY post_id) response ON posts.id= response.post_id 
      WHERE posts.user_id=$1
      ORDER BY created_at DESC`,
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

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/comment/:id", isAuthenticated, async (req, res) => {
  let { id } = req.params;
  let { id: userId } = req.user;

  try {
    let picResult = await db.query(
      "select profile_pic_url from users where id=$1",
      [userId]
    );

    let pic = picResult.rows[0];

    let result = await db.query(
      `SELECT posts.id, users.first_name,users.last_name,users.profile_pic_url,posts.user_id,posts.title,posts.detail,posts.created_at,COALESCE(comment.comments,0)as comments,COALESCE(response.likes,0)as likes,COALESCE(response.dislikes,0)as dislikes 
      FROM posts  
      INNER JOIN users ON users.id= posts.user_id 
      LEFT JOIN(
      SELECT post_id, COUNT(*) AS comments 
      FROM comment 
      GROUP BY post_id) comment ON posts.id= comment.post_id 
      LEFT JOIN(
      SELECT post_id,
      COUNT(CASE WHEN approve=true THEN user_id END)AS likes,
      COUNT(CASE WHEN approve=false THEN user_id END) AS dislikes 
      FROM response 
      GROUP BY post_id) response ON posts.id= response.post_id 
      WHERE posts.id=$1`,
      [id]
    );
    let post = result.rows[0];

    res.render("comment", { post: post, userId: userId, pic: pic });
  } catch (err) {}
});

/////Make request from browser (fetch)/////

app.get("/setting", isAuthenticated, async (req, res) => {
  let { id: userId } = req.user;
  let picResult = await db.query(
    "select profile_pic_url from users where id=$1",
    [userId]
  );

  let pic = picResult.rows[0];
  res.render("setting", { pic: pic });
});

app.post("/comment", isAuthenticated, async (req, res) => {
  let { comment } = req.body;
  let userId = req.user.id;
  let { postId } = req.body;

  try {
    let result = await db.query(
      "INSERT INTO comment(user_id,post_id,comment) values($1,$2,$3) RETURNING *",
      [userId, postId, comment]
    );

    const cmt = result.rows[0];
    const payload = JSON.stringify(cmt);
    client.forEach((client) => {
      if (client.id === postId) {
        return client.line.write(`data: ${payload}\n\n`);
      }
    });
  } catch (err) {
    res.status(500).json({ status: "Faliure" });
    console.log(err);
  }
  res.status(201).json({ status: "success" });
});

app.get("/comments/stream/:id", isAuthenticated, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const postId = req.params.id;
  const clientObj = { id: postId, line: res };
  client.push(clientObj);

  req.on("close", () => {
    client = client.filter((c) => c !== clientObj);
  });
});

app.get("/reaction/stream/", isAuthenticated, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  // res.write(`data: ${JSON.stringify({ connected: true })}\n\n`);

  const clientObj = { line: res };
  client2.push(clientObj);

  req.on("close", () => {
    client2 = client2.filter((c) => c !== clientObj);
  });
});

app.get("/action/:id", isAuthenticated, async (req, res) => {
  let { id: postId } = req.params;
  let userId = req.user.id;

  try {
    let result = await db.query(
      "SELECT  users.id AS user_id, comment.id AS cmt_id,users.first_name,users.last_name,users.profile_pic_url,comment.comment,comment.created_at FROM comment INNER JOIN users ON users.id = comment.user_id WHERE comment.post_id=$1::int ORDER BY comment.created_at DESC ;",
      [postId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: "No comment" });
    }

    res.json({ data: result.rows, user_id: userId });
  } catch (err) {
    res.status(500).json({ status: "Failure" });
    console.log(err);
  }
});

app.post("/cmtdelete/:id", isAuthenticated, async (req, res) => {
  let { id: postId } = req.params;
  const { id } = req.body;
  const message = {
    msg: "deleted",
  };
  try {
    await db.query("DELETE FROM comment Where id=$1", [id]);
    let data = JSON.stringify(message);
    client.forEach((client) => {
      if (client.id === postId) {
        return client.line.write(`data: ${data}\n\n`);
      }
    });
    res.status(200).json({ status: "Deleted" });
  } catch (err) {
    res.status(500).json({ status: "Faliure" });
    console.log(err);
  }
});

app.get("/profilecmt/:id", isAuthenticated, async (req, res) => {
  let { id: profileId } = req.params;
  let userId = req.user.id;

  try {
    let result = await db.query(
      `SELECT  posts.id, users.first_name,users.last_name,users.profile_pic_url,posts.user_id,posts.title,comment.comment,COALESCE(total_count.comments,0)as comment_count,COALESCE(response.likes,0)as likes,COALESCE(response.dislikes,0)as dislikes 
      FROM posts  
      INNER JOIN users ON users.id= posts.user_id 
      INNER JOIN(
        SELECT DISTINCT ON(post_id)post_id,comment,created_at,user_id
        FROM comment
      ) comment ON posts.id=comment.post_id
      LEFT JOIN(
      SELECT post_id,COUNT(*) AS comments 
      FROM comment 
      GROUP BY post_id)AS total_count ON posts.id= total_count.post_id 
      LEFT JOIN(
      SELECT post_id,
      COUNT(CASE WHEN approve=true THEN user_id END)AS likes,
      COUNT(CASE WHEN approve=false THEN user_id END) AS dislikes 
      FROM response 
      GROUP BY post_id) response ON posts.id= response.post_id 
      WHERE comment.user_id=$1::int
      ORDER BY comment.created_at DESC`,
      [profileId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: "No comment on any post" });
    }

    res.json({ data: result.rows, user_id: userId });
  } catch (err) {
    res.status(500).json({ status: "Faliure" });
    console.log(err);
  }
});

app.post("/save", isAuthenticated, async (req, res) => {
  const userId = req.body.userId;
  const postId = req.body.postId;

  try {
    await db.query("insert into saved (user_id,post_id) values($1,$2)", [
      userId,
      postId,
    ]);

    res.status(200).json({ status: "success" });
  } catch (err) {
    if (err.code === "23505") {
      res.json({ message: "This post is already saved by the user" });
    } else {
      res.status(500).json({ status: "Error saving post" });
    }
  }
});

app.get("/save/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    let result = await db.query(
      `SELECT posts.id, users.first_name,users.last_name,users.profile_pic_url,posts.user_id,posts.title,posts.detail,COALESCE(comment.comments,0)as comments,COALESCE(response.likes,0)as likes,COALESCE(response.dislikes,0)as dislikes 
      FROM posts
	    INNER JOIN saved ON posts.id=saved.post_id
      INNER JOIN users ON users.id= posts.user_id 
      LEFT JOIN(
      SELECT post_id, COUNT(*) AS comments 
      FROM comment 
      GROUP BY post_id) comment ON posts.id= comment.post_id 
      LEFT JOIN(
      SELECT post_id,
      COUNT(CASE WHEN approve=true THEN user_id END)AS likes,
      COUNT(CASE WHEN approve=false THEN user_id END) AS dislikes 
      FROM response 
      GROUP BY post_id) response ON posts.id= response.post_id 
      WHERE saved.user_id=$1::int
	    ORDER BY saved.created_at DESC`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No saved post" });
    }
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Faliure" });
  }
});

app.get("/avatar", isAuthenticated, async (req, res) => {
  const user = req.user;
  try {
    const userResult = await db.query("Select * FROM users WHERE id=$1 ", [
      user.id,
    ]);
    const User = userResult.rows[0];
    let result = await db.query("SELECT * FROM avatar ORDER BY id ASC ");
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No avatar" });
    }
    res.json({ rows: result.rows, user: User });
  } catch (err) {
    res.status(500).json({ message: "Server Faliure" });
  }
});

app.patch("/avatar/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;

  try {
    let avatar = await db.query(
      "select profile_pic_url from avatar where id=$1",
      [id]
    );
    if (!avatar.rows[0]) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    let result = await db.query(
      "UPDATE users SET profile_pic_url =$1 WHERE users.id=$2 RETURNING *; ",
      [avatar.rows[0].profile_pic_url, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No success" });
    }
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "Server Faliure" });
  }
});

app.post("/like/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    await db.query(
      "INSERT INTO response (user_id, post_id, approve) VALUES ($1, $2, $3) ON CONFLICT (user_id,post_id) DO UPDATE SET approve= CASE WHEN response.approve = EXCLUDED.approve THEN NULL ELSE EXCLUDED.approve END;",
      [userId, id, true]
    );

    let result = await db.query(
      "SELECT COUNT(CASE WHEN approve = true THEN user_id END) AS likes_count,COUNT(CASE WHEN approve = false THEN user_id END) AS dislikes_count FROM response WHERE post_id = $1;",
      [id]
    );

    const data = {
      postId: id,

      like: result.rows[0].likes_count,
      dislike: result.rows[0].dislikes_count,
    };
    client2.forEach((client) => {
      return client.line.write(`data: ${JSON.stringify(data)}\n\n`);
    });
    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/dislike/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    await db.query(
      "INSERT INTO response (user_id, post_id, approve) VALUES ($1, $2, $3) ON CONFLICT (user_id,post_id) DO UPDATE SET approve= CASE WHEN response.approve = EXCLUDED.approve THEN NULL ELSE EXCLUDED.approve END;",
      [userId, id, false]
    );

    let result = await db.query(
      "SELECT COUNT(CASE WHEN approve = true THEN user_id END) AS likes_count,COUNT(CASE WHEN approve = false THEN user_id END) AS dislikes_count FROM response WHERE post_id = $1;",
      [id]
    );

    const data = {
      postId: id,

      like: result.rows[0].likes_count,
      dislike: result.rows[0].dislikes_count,
    };

    client2.forEach((client) => {
      return client.line.write(`data: ${JSON.stringify(data)}\n\n`);
    });

    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/userlike/", isAuthenticated, async (req, res) => {
  const { id } = req.user;

  try {
    const result = await db.query(
      `SELECT response.post_id,posts.detail,posts.title,users.id,users.first_name,users.last_name,users.profile_pic_url,COALESCE(comment.comments,0)as comments,COALESCE(reaction.likes,0)as likes,COALESCE(reaction.dislikes,0)as dislikes
      FROM response 
      INNER JOIN posts ON posts.id=response.post_id
      INNER JOIN users ON users.id=posts.user_id
      LEFT JOIN(
      SELECT post_id,COUNT(*)AS comments
      FROM comment
      GROUP BY post_id
      )comment ON posts.id=comment.post_id
      LEFT JOIN(
      SELECT post_id,
      COUNT(CASE WHEN approve=true THEN user_id END)AS likes,
      COUNT(CASE WHEN approve=false THEN user_id END) AS dislikes 
      FROM response 
      GROUP BY post_id
      )AS reaction ON posts.id=reaction.post_id
      WHERE response.user_id=$1 AND approve=true
      ORDER BY posts.created_at DESC`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: "No liked posts" });
    }
    res.json({ rows: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

//////////////////////////

app.post("/delete/:id", isAuthenticated, async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  try {
    await db.query("DELETE FROM response Where post_id=$1", [id]);
    await db.query("DELETE FROM comment Where post_id=$1", [id]);
    await db.query("DELETE FROM saved Where post_id=$1", [id]);
    await db.query(`DELETE FROM posts WHERE id=$1 And user_id=$2`, [
      id,
      user.id,
    ]);
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
  }
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
  "local",
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

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/home",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email=$1", [
          profile.email,
        ]);
        if (!result.rows[0]) {
          const newUser = await db.query(
            "INSERT INTO users(first_name,last_name,email,password) values($1,$2,$3,$4) RETURNING *;",
            [profile.given_name, profile.family_name, profile.email, "google"]
          );
          cb(null, newUser.rows[0]);
        } else {
          cb(null, result.rows[0]);
        }
      } catch (err) {
        cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await db.end();
  console.log("DB pool closed");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Server terminated...");
  await db.end();
  process.exit(0);
});

app.listen(port, (req, res) => {
  console.log(`Running on port http://localhost:${port}/`);
});
