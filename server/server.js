const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const routes = require("./routes");

dotenv.config({ path: "./config.env" });

const db = require("./config/connection");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.use(routes);

const PORT = process.env.PORT || 3001;

db.once("open", () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
