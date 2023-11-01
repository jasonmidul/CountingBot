const { Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        
        if (!interaction) return;
        if (!interaction.isChatInputCommand()) return;
        else {
            const channel = await client.channels.cache.get(client.config.logChannel);
            if (interaction.guild === null) return;
            const server = interaction.guild.name;
            const user = interaction.user.tag;
            const userId = interaction.user.id;
            
            const embed = new EmbedBuilder()
            .setTitle("⚠️ Interaction Used")
            .setColor("Blue")
            .addFields({ name: "User", value: `${user} \`${userId}\`` })
            .addFields({ name: "Command", value: `${interaction}` })
            .setFooter({ text: `${server}` })
            .setTimestamp()
            
            await channel.send({ embeds: [embed] });
        }
    
    }
}
