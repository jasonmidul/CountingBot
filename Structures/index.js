const { GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();
const { CountingBot } = require("./Classes/CountingBot")
const { loadEvents } = require("./Functions/EventLoader")
const { antiCrash } = require("./Functions/AntiCrash")


const client = new CountingBot({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction
  ]
});

antiCrash(client);
loadEvents(client);

client.start();