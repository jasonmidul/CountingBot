const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const guildDatas = require('../../schemas/guild')
const banDatas = require('../../schemas/ban')

module.exports = {
    data: new SlashCommandBuilder()
      .setName('disable')
      .setDMPermission(false)
      .setDescription('To disable count game!'),
    async execute(interaction, client) {

        const guildData = await guildDatas.findOne({ guildId: interaction.guild.id });
        
        const disableFailedEmbed = new EmbedBuilder()
          .setTitle('❌ Failed To Disable')
          .setDescription(`**You can't disable count game in this guild!**\nCount game already disabled in this guild.`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp()
        
        const disableEmbed = new EmbedBuilder()
          .setTitle('✅ Disabled Count Game')
          .setDescription(`**Successfully count game has been disabled on this guild.**`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp()
        
        const permEmbed = new EmbedBuilder()
          .setTitle('❌ Permission Error')
          .setDescription(`**You don’t have enough permission for use this command!**`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp()
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [permEmbed], ephemeral: true });
        
        if (!guildData) return await interaction.reply({ embeds: [disableFailedEmbed], ephemeral: true })
        else {
          
          const channel = client.channels.cache.get(guildData.countChannel);
          await guildDatas.deleteMany({ guildId: interaction.guild.id });
          await banDatas.deleteMany({ guildId: interaction.guild.id });
          await channel.send({ content: `💔 **Count game has been disabled in this guild..**` })
          await interaction.reply({ embeds: [disableEmbed], ephemeral: true })
        }
    }
}