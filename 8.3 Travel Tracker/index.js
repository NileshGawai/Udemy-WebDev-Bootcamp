import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "pgNg208%",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.
  const result = db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  (await result).rows.forEach((country) => {
    countries.push(country.country_code);
  });

  console.log((await result).rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
