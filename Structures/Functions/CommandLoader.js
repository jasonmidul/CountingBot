const { CountingBot } = require("../Classes/CountingBot");
const fs = require('fs');


/**
 * @param {CountingBot} client
 */

async function loadCommands(client) {
  const { commands, config, application, guilds } = client;
  commands.clear();
  let Loaded = 0;
  let Failed = 0;
  let CommandArray = [];
  const folders = fs.readdirSync(`./Interactions`);
  for (const folder of folders) {
    const files = fs.readdirSync(`./Interactions/${folder}`).filter((file) => file.endsWith(".js"));
    const folderCommands = files.map((file) => require(`../../Interactions/${folder}/${file}`));
    const validCommands = folderCommands.filter((command) => command.data.name);
    commands.add(validCommands);
    CommandArray.push(...validCommands.map((command) => command.data.toJSON()));
    Loaded += validCommands.length;
    Failed += files.length - validCommands.length;
  }
  console.log(`Loaded ${Loaded} commands`);
  if (Failed !== 0) console.log(`Failed to load ${Failed} command`);
  if (config.global) {
    application.commands.set(CommandArray);
  } else {
    const guild = guilds.cache.get(config.devGuildId);
    if (guild) {
      guild.commands.set(CommandArray);
    }
  }
}

module.exports = { loadCommands };
