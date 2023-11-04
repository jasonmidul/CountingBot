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
  
  const folders = fs.readdirSync(`./Interactions`)

  for (const folder of folders) {

    const files = fs.readdirSync(`./Interactions/${folder}`).filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const command = require(`../../Interactions/${folder}/${file}`);
      
      if (!command.data.name) return Failed++
      commands.set(command.data.name, command);
      CommandArray.push(command.data.toJSON());
    
      Loaded++
    
    }
    
  }
  
  if (Loaded !== 0) console.log(`Loaded ${Loaded} commands`);
  if (Failed !== 0) console.log(`Failed to load ${Failed} command`);
  
  if (config.global == true) {
    
    application.commands.set(CommandArray);
    
  } else {
    
    const guild = guilds.cache.get(config.devGuildId);
    if (!guild) return;
    
    guild.commands.set(CommandArray)
    
  }
  
}

module.exports = { loadCommands };
