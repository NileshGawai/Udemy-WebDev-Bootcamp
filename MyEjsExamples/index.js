import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  // res.send("It works!");
  const data = {
    title: "EJS Tags",
    seconds: new Date().getSeconds(),
    // items: ["🍎  Apples", "🍊  Oranges", "🍐  Pears"],
    items: ["Apples", "Oranges", "Pears"],
    htmlContent: "<em> This is some emphasized text. </em>",
  };
  res.render("index.ejs", data);
});

app.listen(port, () => {
  console.log(`The server is listening on port: ${port}`);
});
