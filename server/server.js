const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const routes = require("./routes");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("../schemas/typeDefs");
const resolvers = require("../schemas/resolvers");
const { authMiddleware } = require("./utils/auth");

dotenv.config({ path: "./config.env" });
const db = require("./config/connection");

const app = express();

// Create an ApolloServer instance with typeDefs, resolvers, and context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Start the ApolloServer and apply the middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  app.use(routes);

  const PORT = process.env.PORT || 3001;

  db.once("open", () => {
    app.listen(PORT, () =>
      console.log(`🌍 Now listening on localhost:${PORT}`)
    );
  });
}

startServer();
