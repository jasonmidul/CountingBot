const { EmbedBuilder, CommandInteraction } = require("discord.js");
/**
 *@param {CommandInteraction} interaction
 *@param {Staring} description
 *@param {Boolean} type
 *@param {Staring} color
 *@param {Staring} title
 */

function Reply(interaction, title, color, description, type) {
  
  interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setDescription(description)
    ],
    ephemeral: type || true
  })
}

module.exports = { Reply };