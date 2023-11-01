const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const banDatas = require('../../schemas/ban');
const guildDatas = require('../../schemas/guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('counter-unmute')
          .setDMPermission(false)
          .setDescription('Unmute a user from counting channel mute list!')
          .addUserOption(option => option.setName('user').setDescription('Select a user to unmute on counting channel!').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const banData = await banDatas.findOne({
          userId: target.id,
          guildId: interaction.guild.id
        });
        const guildData = await guildDatas.findOne({ guildId: interaction.guild.id });
        
        const errorEmbed = new EmbedBuilder()
          .setTitle('❌ Failed')
          .setDescription(`**Here is not available the count game to run this command!**\nTo setup count game use \`/setup\` command.`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp();
        const permEmbed = new EmbedBuilder()
          .setTitle('❌ Permission Error')
          .setDescription(`**You don’t have enough permission for use this command!**`)
         .setColor('#2f3136')
         .setFooter({ text: 'Counter Bot - 2023' })
         .setTimestamp();
        
        const unmuteEmbed = new EmbedBuilder()
          .setTitle('✅ User Unmuted')
          .setDescription(`**Successfully** ${target} **got unmuted on count game.**`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp();
        
        const unmuteFailedEmbed = new EmbedBuilder()
          .setTitle('❌ Failed To Unmute')
          .setDescription(`**You can't unmute a unmuted member!**\n${target} is already unmuted on count game.`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp();
        const dmEmbed = new EmbedBuilder()
          .setTitle('📩 Notice')
          .setDescription(`**You got unmuted on count game! **\nNow you can play count game there.`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp()
        
        const button = new ButtonBuilder()
          .setCustomId('disabled')
          .setLabel(`Sent from: ${interaction.guild.name}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true);
        
        const row = new ActionRowBuilder()
          .addComponents(button);
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [permEmbed], ephemeral: true });
        
        if (!guildData) return await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        
        if (!banData) {
            return interaction.reply({ embeds: [unmuteFailedEmbed], ephemeral: true });
        }
        await banDatas.deleteMany({
          guildId: interaction.guild.id,
          userId: target.id,
        });
        
        interaction.reply({ embeds: [unmuteEmbed] });
        target.send({ embeds: [dmEmbed], components: [row] })
    },
};
