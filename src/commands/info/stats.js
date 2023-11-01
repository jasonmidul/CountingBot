const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, Client, ChannelType, UserFlags, version } = require("discord.js");
const { connection } = require("mongoose");
const os = require("os");

module.exports = {
  data : new SlashCommandBuilder()
  .setName("stats")
  .setDescription("Shows the status of the bot."),
  /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
  async execute(interaction, client) {
      
        const status = [
            "Disconnected",
            "Connected",
            "Connecting",
            "Disconnecting"
        ];

    await client.user.fetch();

        await client.application.fetch();

        

        const getChannelTypeSize = type => client.channels.cache.filter(channel => type.includes(channel.type)).size;
      
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;

        

  interaction.reply({embeds: [

            new EmbedBuilder()

                .setColor("#2f3136")
                .setTimestamp()

                .setTitle(`${client.user.username}'s Stats`)
                .setFooter({ text: `Request by - ${interaction.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                .setDescription("Hi, here is my stats.")

                .addFields(

                    { name: "__**Network Info:**__", value: `**Created**: <t:${parseInt(client.user.createdTimestamp / 1000)}:R> \n**Database**: ${status[connection.readyState]} \n **Uptime**: ${uptime} \n **Ping**: ${client.ws.ping}ms \n **Status**: Online `, inline: true },

                    { name: "__**Bot Info:**__", value: ` **Owner**: ${client.application.owner.tag || "Midul"} \n **Commands**: ${client.commands.size} \n **Servers**: ${client.guilds.cache.size} \n **Users**: ${client.guilds.cache.reduce((acc, guild) => acc+guild.memberCount, 0)} \n **Channels**: ${client.channels.cache.size}`, inline: true }
                )

        ], ephemeral: false });

    }

};

  

