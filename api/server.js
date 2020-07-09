const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { json } = require("express");
const userRouter = require("./contacts/contacts.router");

dotenv.config();

const PORT = process.env.PORT;
module.exports = class UsersServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.serverListening();
  }
  initServer() {
    this.server = express();
  }
  initMiddlewares() {
    this.server.use(json());
    this.server.use(cors({ origin: `http://localhost:${PORT}` }));
  }
  serverListening() {
    this.server.listen(PORT, () =>
      console.log("Server start successful at port:", PORT)
    );
  }
  initRoutes() {
    this.server.use("/api/contacts", userRouter);
  }
};
