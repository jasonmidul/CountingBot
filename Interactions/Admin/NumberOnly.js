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

    const guildData = await guildDatas.findOne({ id: interaction.guild.id });

    const countOnlyEmbed = new EmbedBuilder()
      .setTitle('✅ Counter Only Updated')
      .setDescription(`**Successfully counter only setting has been updated to -** \`${option}\``)
      .setColor('#2f3136')
      .setFooter({ text: 'Counter Bot - 2023' })
      .setTimestamp()

    if (!guildData) return await interaction.reply({ content: `❌ Counting channel is not available in this guild. `, ephemeral: true })
    else {

      guildData.numOnly = option;
      guildData.save();

      await interaction.reply({ embeds: [embed], ephemeral: true })
    }
  }
}