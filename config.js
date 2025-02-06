const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  botToken: process.env.token,
  mongoUrl: process.env.mongoUrl,
  redis: process.env.redis,
  clientId: "1293072781491044415",
  logChannel: "1293079076697018469",
  voteLog: "1293079113787113493",
  deploySlashOnReady: true,
  underDevelopment: false,
  developers: [
    {
      name: "Jason Midul",
      id: "948807824446742568",
    },
  ],
  devGuilds: [
    {
      name: "Bettle Counter",
      id: "1293078905430736928",
    },
  ],
  betaTestGuilds: [],
  cTopic:
    "Counting Rules: \n\n1 • No Skipping Numbers\n2 • No Going Back In Numbers\n3 • Must alternate counters (except for solo mode)\n4 • No Botting, Scripting Or Abusing Bugs\n5 • Do Not Intentionally Ruin The Count",
  voteUrl: "https://top.gg/bot/1293072781491044415/vote",
  logWebhook: process.env.logWebhook,
};
