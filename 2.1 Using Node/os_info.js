const os = require("node:os");

const message = "Operating System Information";
console.log(message);
console.log("=".repeat(message.length + 5));

console.log("OS Name: " + os.type);
console.log("OS version: " + os.version());
console.log("OS Architechture: " + os.arch());
console.log("OS Platform: " + os.platform());

console.time("bunch-of-stuff");
// Do a bunch of stuff.
console.timeEnd("bunch-of-stuff");
// Prints: bunch-of-stuff: 225.438ms
