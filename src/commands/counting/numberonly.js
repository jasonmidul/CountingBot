const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const guildDatas = require('../../schemas/guild')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('numberonly')
    .setDMPermission(false)
    .setDescription('Toggle count only channel!')
    .addStringOption((option) => option.setName("toggle").setDescription("Counting channel should count only or not!").setRequired(true).addChoices({ name: 'On', value: "true" }, { name: 'Off', value: "false" } )),
  async execute(interaction) {
    
    const countOnly = interaction.options.getString("toggle");
    
    const guildData = await guildDatas.findOne({ guildId: interaction.guild.id });
    
    const permEmbed = new EmbedBuilder()
      .setTitle('❌ Permission Error')
      .setDescription(`**You don’t have enough permission for use this command!**`)
      .setColor('#2f3136')
      .setFooter({ text: 'Counter Bot - 2023' })
      .setTimestamp()
    
    const errorEmbed = new EmbedBuilder()
      .setTitle('❌ Failed')
      .setDescription(`**Here is not available the count game to run this command!**\nTo setup count game use \`/setup\` command.`)
      .setColor('#2f3136')
      .setFooter({ text: 'Counter Bot - 2023' })
      .setTimestamp()
    
    const countOnlyEmbed = new EmbedBuilder()
      .setTitle('✅ Counter Only Updated')
      .setDescription(`**Successfully counter only setting has been updated to -** \`${countOnly}\``)
      .setColor('#2f3136')
      .setFooter({ text: 'Counter Bot - 2023' })
      .setTimestamp()
    
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [permEmbed], ephemeral: true });
    
    if (!guildData) return await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
    else {

      guildData.countOnly = countOnly;
      guildData.save();
      
      await interaction.reply({ embeds: [countOnlyEmbed], ephemeral: true })
    }
  }
}