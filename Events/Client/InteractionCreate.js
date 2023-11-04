const { EmbedBuilder, Events, ChatInputCommandInteraction } = require("discord.js");
const { CountingBot } = require("../../Structures/Classes/CountingBot");
const { Reply } = require("../../Systems/Reply");

module.exports = {
  name: Events.InteractionCreate,
  
  /**
   * @param {CountingBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  
  async execute(interaction, client) {
    
    if (!interaction.isChatInputCommand()) return;
    
    const { commandName, guild, user } = interaction;
    
    if (!guild) return;
    
    const command = client.commands.get(commandName);
    
    if (!command) return client.commands.delete(commandName) && Reply(interaction, `❌ Undefined Interaction`, `Red`, `Something went rong! Try again letter. [Get support here](${client.config.support})`, true)
    
    if (command.devOnly && !client.config.devs.includes(user.id)) return Reply(interaction, `❌ Permission Error`, `Red`, `Only bot owner can use this command! [Get support here](${client.config.support})`, true)
    
    

    try {
      await command.execute(interaction, client);
    } catch (error) {

      console.log('[⚠] Catched an error -' + error);
      
      await Reply(interaction, `❌ Interaction Error`, `Red`, `Something went rong! Try again letter. Report bug [here](${client.config.support}) and get support [here](${client.config.support})`, true);
    }
  },
};