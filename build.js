const fs = require("fs");

// Read template
let html = fs.readFileSync("index.html", "utf8");

// Inject environment variables
html = html
  .replace(/%%FIREBASE_API_KEY%%/g,              process.env.FIREBASE_API_KEY || "")
  .replace(/%%FIREBASE_AUTH_DOMAIN%%/g,          process.env.FIREBASE_AUTH_DOMAIN || "")
  .replace(/%%FIREBASE_PROJECT_ID%%/g,           process.env.FIREBASE_PROJECT_ID || "")
  .replace(/%%FIREBASE_MESSAGING_SENDER_ID%%/g,  process.env.FIREBASE_MESSAGING_SENDER_ID || "")
  .replace(/%%FIREBASE_APP_ID%%/g,               process.env.FIREBASE_APP_ID || "");

// Write to dist
if (!fs.existsSync("dist")) fs.mkdirSync("dist");
fs.writeFileSync("dist/index.html", html);
console.log("Build complete — env vars injected.");
