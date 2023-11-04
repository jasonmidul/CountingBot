const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { CountingBot } = require("../../Structures/Classes/CountingBot")
const guildDatas = require('../../Schemas/GuildSchema')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setchannel')
    .setDMPermission(false)
    .setDescription('Setup a counting channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => option.setName('channel').setDescription('Select a channel where you want setup.').setRequired(false).addChannelTypes(ChannelType.GuildText)),
  
  /**
   *@param {CountingBot} client
   */
  
  async execute(interaction, client) {

    const channel = interaction.options.getChannel('channel') || client.channels.cache.get(interaction.channel.id);
    
    const guildData = await guildDatas.findOne({ id: interaction.guild.id });
    
    const embed = new EmbedBuilder()
      .setColor('#2f3136')
    
    if (guildData && guildData.channelId == channel.id) {
      
      embed.setDescription(`❌ The counting channel has already setuped in <#${channel.id}>.`)
      return interaction.reply({ embeds: [embed] })
    }
    
    if (guildData && guildData.channelId == '0' ) {
      guildData.channelId = channel.id;
      guildData.name = interaction.guild.name;
      guildData.save();
      embed.setDescription(`✅ The counting channel has been setuped in <#${channel.id}>.`)

    } else if (guildData && guildData.channelId !== '0') {
      guildData.channelId = channel.id;
      guildData.name = interaction.guild.name;
      guildData.save();
      embed.setDescription(`✅ The counting channel has been moved to <#${channel.id}>.`)
    } else {
      guildDatas.create({
        id: interaction.guild.id,
        name: interaction.guild.name,
        channelId: channel.id,
      })
      embed.setDescription(`✅ The counting channel has been setuped in <#${channel.id}>.`)

    }
    
    await interaction.reply({ embeds: [embed] })
    await channel.send(`✨ **This channel has been setuped as a counting channel!**`);
   
  }
}