import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "TOPSECRET",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000,
  }
}));

app.use(passport.initialize());
app.use(passport.session());


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "pgNg208%",
  port: 5432,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.render("secrets.ejs", { user: req.user });
  } else {
    res.redirect("./login");
  }
})

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
          req.user = user;
          req.login(user, (err) => {
            if (err) {
              console.error("Error logging in:", err);
            } else {
              res.render("secrets.ejs");
            }
          });

        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/login",
}));

passport.use(new Strategy(async function verify(username, password, cb) {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          return cb(err);
          // console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            return cb(null, user);
            // res.render("secrets.ejs");
          } else {
            return cb(null, false);
            // res.send("Incorrect Password");
          }
        }
      });
    } else {
      return cb("User not found");
      // res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});


passport.deserializeUser(function (user, cb) {
  cb(null, user);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
