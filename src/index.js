const { Client, GatewayIntentBits, Collection, Partials } = require(`discord.js`);
const configuration = require('../config')
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages
    ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.Reaction
    ]
});


client.commands = new Collection();
client.config = new Collection();

const handlers = fs.readdirSync("./src/handlers").filter(file => file.endsWith(".js"));
const eventFolders = fs.readdirSync("./src/events");
const commandFolders = fs.readdirSync("./src/commands");

const process = require('node:process');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('warning', (warning) => {
  console.warn('Warning:', warning);
});

client.on('rateLimit', (rateLimitInfo) => {
  console.warn('Rate Limit:', rateLimitInfo);
});

client.on('error', (error) => {
  console.error('Discord.js Error:', error);
});


(async () => {
  for (file of handlers) {
    require(`./handlers/${file}`)(client);
  }
  client.handleEvents(eventFolders, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
  client.login(client.config.token)
})();
