const {
  SlashCommandBuilder,
  EmbedBuilder, ChatInputCommandInteraction
} = require('discord.js');
const { CountingBot } = require("../../Structures/Classes/CountingBot");
const userDatas = require('../../Schemas/UserSchema');

/**
 * @param {CountingBot} client
 * @param {ChatInputCommandInteraction} interaction
 */
  

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Check your vote stats.'),
    
    async execute(interaction, client) {
        
        const userData = await userDatas.findOne({
          id: interaction.user.id,
        });
        
        if (!userData) {
          await userDatas.create({
            id: interaction.user.id,
            name: interaction.user.username
          })
        };
        const red = "Red";
        const green = "Green";

        const now = new Date();
        const lastVoted = userData.vote.time;
        const voteMs = 1000 * 60 * 60 * 12;
        const resolve = now - lastVoted;
        const embed = new EmbedBuilder()
        
        

        if (resolve < voteMs) {
            const remainingTime = voteMs - resolve;
            const remainingTimeHours = Math.floor(remainingTime / (1000 * 60 * 60));
            const remainingTimeMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            
             embed.setDescription(`**You have alrady voted.** \n\n> You can vote after **${remainingTimeHours}** hour, **${remainingTimeMinutes}** minute.`)
            embed.setTitle(`Voting For Counting Bot`)
            embed.setTimestamp()
            embed.setColor(red)
            await interaction.reply({ embeds: [embed] });
        } else {
            
            embed.setDescription(`**Your vote is available.** \n\n> Vote now by click **[here](https://top.gg/bot/1106236979147964426/vote)**!`)
            embed.setTitle(`Voting For Counting Bot`)
            embed.setTimestamp()
            embed.setColor(client.color)
            await interaction.reply({ embeds: [embed] });
        }
    },
};
