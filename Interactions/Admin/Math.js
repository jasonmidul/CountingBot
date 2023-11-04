const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const guildDatas = require('../../Schemas/GuildSchema')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disablemath')
    .setDMPermission(false)
    .setDescription('Toggle math mood in counting channel!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => option.setName("disable").setDescription("Counting Bot").setRequired(true).addChoices({ name: 'true', value: "true" }, { name: 'false', value: "false" })),
  async execute(interaction) {

    const math = interaction.options.getString("disable");

    const guildData = await guildDatas.findOne({ id: interaction.guild.id });

    const embed = new EmbedBuilder()
      .setDescription(`✅ Successfully math has been set to ${math}`)
      .setColor('#2f3136')
      .setFooter({ text: 'Counter Bot - 2023' })
      .setTimestamp()

    if (!guildData) return await interaction.reply({ content: `❌ Counting channel is not available in this guild. `, ephemeral: true })
    else {

      guildData.math = math;
      guildData.save();

      await interaction.reply({ embeds: [embed], ephemeral: true })
    }
  }
}