const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const guildDatas = require('../../schemas/guild')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDMPermission(false)
    .setDescription('To setup a counting channel!')
    .addChannelOption(option => option.setName('channel').setDescription('Which channel you want setup counting game!').setRequired(true).addChannelTypes(ChannelType.GuildText)),
    async execute(interaction) {
        
        const channel = interaction.options.getChannel('channel');
        const guildData = await guildDatas.findOne({ guildId: interaction.guild.id });
        
        const setupFailedEmbed = new EmbedBuilder()
          .setTitle('❌ Failed To Setup')
          .setDescription(`**Count game is already setuped on this guild!**\nYou can setup only **1** count game in a guild.`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp()
        
        const permEmbed = new EmbedBuilder()
          .setTitle('❌ Permission Error')
          .setDescription(`**You don’t have enough permission for use this command!**`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp()
        const setupEmbed = new EmbedBuilder()
          .setTitle('✅ Setuped Count Game')
          .setDescription(`**Successfully count game has been setuped in this guild at** ${channel}\nTo view and change game setting use \`/setting\` command.`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp()
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [permEmbed], ephemeral: true });
        
        if (guildData) return await interaction.reply({ embeds: [setupFailedEmbed], ephemeral: true })
        else {
        
          guildDatas.create({
            guildId: interaction.guild.id,
            guildName: interaction.guild.name,
            countChannel: channel.id,
            lastScore: 0,
            counterRole:interaction.guild.id,
            lastUser: ' ',
            highScore: 0,
            countOnly: 'true',
          })
          
          await interaction.reply({ embeds: [setupEmbed], ephemeral: true })
          await channel.send(`✨ **Count game has been setuped on this channel!**`);
        }
    }
}