const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { CountingBot } = require("../../Structures/Classes/CountingBot");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with Counting Bot.'),
  
  /**
 * @param {CountingBot} client
 * @param {ChatInputCommandInteraction} interaction
 */
  
  async execute (interaction, client) {

    let commands = [];

    // Map out the name and description of each command
    client.commands.forEach(command => {
      commands.push({
        name: command.data.name || "Error",
        description: command.data.description || "Error"
      });
    });

    // Map it to a list of objects, if undefined, ignore it
    const commandList = commands.map(command => {
      return {
        name: `/${command.name}`,
        value: `${command.description}` // This is an invisible character, discord doesn't like empty fields
      };
    });

    const embed = {
      color: parseInt("#2f3136".replace("#", ""), 16),
      title: `Counting Help`,
      description: `Here are all the commands you can use!`,
      fields: commandList,
      footer: {
        text: `${client.user.username} | ${interaction.guild.name}`
      }
    };

    await interaction.reply({
      embeds: [embed]
    });
    

  }
};
