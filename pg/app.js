import pg from "pg";

const { Client } = pg;

const client = new Client({
  user: "postgres",
  password: "pgNg208%",
  host: "localhost",
  port: 5432,
  database: "world",
});

client.connect();

client.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.log("Error executing query.", err.stack);
  } else {
    console.log("First 10 row fetched...");

    let count = 0;
    while (count < 10) {
      console.log("User data:", res.rows[count]);
      count++;
    }
  }
  client.end();
});
