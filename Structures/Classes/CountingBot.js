const { Client, Colors, Collection } = require("discord.js");
const configuration = require("../../config.json");
const mongoose = require("mongoose");

class CountingBot extends Client {
  
  color = configuration.color;
  config = configuration;
  commands = new Collection();
  events = new Collection();

  start() {
    const db = process.env.MONGO;
    const token = process.env.TOKEN;

    this.login(token)
      .then(() => {
        if (!db) return;
        mongoose.set("strictQuery", false);
        mongoose.connect(db)
          .then(data => {
            console.log(`Connected to: ${data.connection.name}`)
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
}

module.exports = { CountingBot };