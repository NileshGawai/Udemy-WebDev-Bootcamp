const fs = require("node:fs");

fs.writeFile("message.txt", "Hello World Node!\nHello, Nilesh!", (err) => {
  if (err) throw err;
  console.log("The file has been saved.");
});

fs.readFile("message.txt", "utf-8", (err, data) => {
  console.log("Reading file...");
  if (err) throw err;
  console.log(data);
});
