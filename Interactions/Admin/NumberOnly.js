const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const guildDatas = require('../../Schemas/GuildSchema')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('numonly')
    .setDMPermission(false)
    .setDescription('Toggle count only channel!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => option.setName("enable").setDescription("Counting channel should count only or not!").setRequired(true).addChoices({ name: 'true', value: "true" }, { name: 'false', value: "false" })),
  async execute(interaction) {

    const option = interaction.options.getString("enable");
  let updateMessage = `❌ Counting channel is not available in this guild.`;
  const guildData = await guildDatas.findOneAndUpdate({ id: interaction.guild.id }, { numOnly: option }, { new: true, upsert: true });
  if (guildData) {
    updateMessage = `✅ Counter Only Updated\n**Successfully counter only setting has been updated to -** \`${option}\``;
  }

      guildData.numOnly = option;
      guildData.save();

      await interaction.reply({ embeds: [embed], ephemeral: true })
    }
  }