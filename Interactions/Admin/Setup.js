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
  
  let guildData = await guildDatas.findOneAndUpdate(
    { id: interaction.guild.id },
    {
      $setOnInsert: {
        id: interaction.guild.id,
        name: interaction.guild.name,
      },
      $set: {
        channelId: channel.id,
      },
      $setOnInsert: {
        channelId: channel.id,
      },
    },
    { upsert: true, new: true }
  );
  
  const embed = new EmbedBuilder()
    .setColor('#2f3136');

  if (guildData.channelId === channel.id) {
    embed.setDescription(`❌ The counting channel has already been set up in <#${channel.id}>.`);
  } else if (guildData.channelId === '0') {
    embed.setDescription(`✅ The counting channel has been set up in <#${channel.id}>.`);
  } else {
    embed.setDescription(`✅ The counting channel has been moved to <#${channel.id}>.`);
  }

  await interaction.reply({ embeds: [embed] });
  await channel.send(`✨ **This channel has been set up as a counting channel!**`);
}
}