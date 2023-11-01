const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const guildDatas = require('../../schemas/guild')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('countrole')
    .setDMPermission(false)
    .setDescription('Set a role which can play count game!')
    .addRoleOption(option => option.setName('role').setDescription('The role which can play count game!').setRequired(true)),
  async execute(interaction) {
    
    const role = interaction.options.getRole('role');

    const guildData = await guildDatas.findOne({ guildId: interaction.guild.id });
    
    const counterRoleEmbed = new EmbedBuilder()
      .setTitle('✅ Counter Role Updated')
      .setDescription(`**Successfully counter role has been updated.**\nNow only member haveing ${role} can play count game.`)
      .setColor('#2f3136')
      .setFooter({ text: 'Counter Bot - 2023' })
      .setTimestamp()
    
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
    
    if (!guildData) return await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
    else {
      
      guildData.counterRole = role.id;
      guildData.save();
      await interaction.reply({ embeds: [counterRoleEmbed], ephemeral: true });
    }
  }
}
