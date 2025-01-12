import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "pgNg208%",
  port: 5432,
});

db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.error(err);
  }
});

app.post("/add", async (req, res) => {

  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  } catch (err) {
    console.log(err);
  }

  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const itemId = req.body.updatedItemId;
  const itemTitle = req.body.updatedItemTitle;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = ($2) ", [itemTitle, itemId]);
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");

});

app.post("/delete", async (req, res) => {
  const itemIdToDelete = req.body.deleteItemId;

  try {
    await db.query("DELETE FROM items WHERE id = ($1) ", [itemIdToDelete]);
  } catch (err) {
    console.log(err);
  }

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
