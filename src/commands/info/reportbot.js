const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("reportbot")
    .setDescription("report a bug to the Developers of this Bot!")
    .addStringOption(option => option
        .setName("command")
        .setDescription("The not-working/bugging command")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("details")
        .setDescription("Describe the Problem (not required, you can leave that blank ) :)")
        .setRequired(false)
    ),
 
    async execute (interaction, client) {
        const USER = interaction.user.tag;
        const Command = interaction.options.getString("command");
        const BUG = interaction.options.getString("details") || "No details given!";
 
        const embed = new EmbedBuilder()
        .setTitle("NEW REPORTED BUG!")
        .setDescription(`>>> Bug: ${BUG}`)
        .setTimestamp()
        .setColor('Green')
        .addFields({ name: "• Command:", value: `>>> ${Command}`, inline: false})
        .addFields({ name: `user`, value: `>>> ${USER}`, inline: false})
 
        const sendEmbed = new EmbedBuilder()
        .setTitle("YOU REPORTED A BUG!")
        .setDescription(`Bug: ${BUG}`)
        .setTimestamp()
        .setColor('Green')
        .addFields({ name: "• Command:", value: `>>> ${Command}`})
        .setFooter({ text: "The Developer Team will contact you as fast as they can!"})
 
        const channel = client.channels.cache.get(client.config.reportLog);
 
        channel.send({
            embeds: [embed]
        }).catch(err => {
            return;
        });
 
        return interaction.reply({ embeds: [sendEmbed], ephemeral: true }).catch(err => {
            return;
        });
 
    }
}