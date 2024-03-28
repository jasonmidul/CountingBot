const { Client, Colors, Collection } = require("discord.js");
const configuration = require("../../config.json");
const mongoose = require("mongoose");

class CountingBot extends Client {
  
  color = configuration.color;
  config = configuration;
  commands = new Collection();
  events = new Collection();

async start() {
  const db = process.env.MONGO;
  const token = process.env.TOKEN;

  try {
    if (!db) return;
    mongoose.set("strictQuery", false);
    const data = await mongoose.connect(db);
    console.log(`Connected to: ${data.connection.name}`);
  } catch (err) {
    console.log(err);
  }

  try {
    await this.login(token);
  } catch (err) {
    console.log(err);
  }
}
}

module.exports = { CountingBot };