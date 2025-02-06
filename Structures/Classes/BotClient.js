const { Client, Collection } = require("discord.js");
const Redis = require("ioredis");
const { EventHandler } = require("../Handlers/EventHandler");
const { Logger } = require("../Functions/index");
const Config = require("../../config");
const db = require("../../Schemas/index");
const logger = new Logger();

class BotClient extends Client {
  constructor(options) {
    super(options);

    this.config = Config;
    this.events = new Collection();
    this.buttons = new Collection();
    this.modals = new Collection();
    this.autoComplete = new Collection();
    this.slashCommands = new Collection();
    this.db = db;
    this.redis = new Redis(this.config.redis);
  }
  async start() {
    await this.registerModules();
    await this.login(this.config.botToken);
  }
  async registerModules() {
    const { loadEvents } = new EventHandler();

    try {
      await loadEvents(this);
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = { BotClient };
