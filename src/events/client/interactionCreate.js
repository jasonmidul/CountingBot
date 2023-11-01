const { Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return

    try {
      await command.execute(interaction, client);
    } catch (error) {
      const embed = new EmbedBuilder()
        .setTitle("❌ Interaction Error")
        .setDescription('Something went rong! Try again letter. \n> 🎟️ **[Get Support](https://discord.gg/PZQT6c7gJn)**')
        .setColor("Red")
        .setFooter({ text: `Use /report Command` })

      console.log('[⚠️] Catched an error -' + error);
      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }
  },
};