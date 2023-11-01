const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const banDatas = require('../../schemas/ban');
const guildDatas = require('../../schemas/guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('counter-mute')
          .setDMPermission(false)
          .setDescription('Mute a user on counting game! (the messages sent from muted users will be remove)')
          .addUserOption(option => option.setName('user').setDescription('Select a user to mute on counting channel!').setRequired(true))
          .addStringOption(option => option.setName("reason").setDescription("Why you want to mute?").setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || "Not provided";
        const banData = await banDatas.findOne({
          userId: target.id,
          guildId: interaction.guild.id
        });
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
        const dmEmbed = new EmbedBuilder()
          .setTitle('📩 Notice')
          .setDescription(`**You got muted on count game! **\n**Reasone:** (*${reason}*`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp()
        const muteFailedEmbed = new EmbedBuilder()
          .setTitle('❌ Failed To Mute')
          .setDescription(`**You can't mute this user again!**\n${target} is already muted on count game.`)
          .setColor('#2f3136')
          .setFooter({ text: 'Counter Bot - 2023' })
          .setTimestamp()
        const muteEmbed = new EmbedBuilder()
          .setTitle('✅ User Muted')
          .setDescription(`**Successfully **${target}** got muted on count game. (reason:** *${reason}* **)** \n\`Note: (Just ignore messages send from muted members and delete them.)\``)
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
        
        if (banData) {
            return interaction.reply({ embeds: [muteFailedEmbed], ephemeral: true });
        }
        await banDatas.create({
          guildId: interaction.guild.id,
          userId: target.id,
          reason: reason,
        });
        
        await interaction.reply({ embeds: [muteEmbed], ephemeral: true });
        target.send({ embeds: [dmEmbed], components: [row] });
    },
};
