import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  const numOfLetters = req.body["fName"].length + req.body["lName"].length;
  let firstName = req.body["fName"];
  let lastName = req.body["lName"];
  // console.log(`${firstName} with ${lastName}`);
  res.render("index.ejs", {
    numberOfLetters: numOfLetters,
    firstName: firstName,
    lastName: lastName,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
