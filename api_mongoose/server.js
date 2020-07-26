const express = require("express");
const mongoose = require("mongoose");
const contactRouter = require("../users/contact.router.js");

require("dotenv").config();

module.exports = class UserServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddleware();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }
  initServer() {
    this.server = express();
  }
  initMiddleware() {
    this.server.use(express.json());
  }
  initRoutes() {
    this.server.use("/contacts", contactRouter);
  }

  async initDatabase() {
    await mongoose.connect(process.env.MONGODB_URL);
  }

  startListening() {
    const PORT = process.env.PORT;
    this.server.listen(PORT, () => {
      console.log("Database connection successful", PORT);
    });
  }
};
