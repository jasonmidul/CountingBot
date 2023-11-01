const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const guildDatas = require('../../schemas/guild'); // replace with your User model path

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top-score')
    .setDMPermission(false)
    .setDescription('View the top highest score!'),
  async execute(interaction) {
    // find the top 10 users by wallet value
    const guildData = await guildDatas.find().sort({ highScore: -1 }).limit(10);
    const guildScore = await guildDatas.findOne({ guildId: interaction.guild.id });
    
    // create a message embed to display the leaderboard
    const embed = new EmbedBuilder()
      .setTitle('🏆 Highest Score')
      .setFooter({ text: 'Top 10 highest score!' })
      .setColor('#2f3136')
      .setTimestamp();
      
    if (guildScore) {
      
      const guildIndex = await guildDatas.find().sort({ highScore: -1 });
      
      const rank = guildIndex.findIndex((b) => b.guildId === interaction.guild.id);
      
      embed.setDescription(`> ${interaction.guild.name} on **#${rank + 1}** and the high score is **${guildScore.highScore}**!`);
    };
    if (!guildScore) {
      embed.setDescription(`**Count game is not available in this guild!** \nTo get a position use \`/setup\` command.`)
    };

    // add a field for each user in the leaderboard
    guildData.forEach((guildId, index) => {
      embed.addFields({ name: `${index + 1 === 1 ? '🥇' : `${index + 1 === 2 ? '🥈' : `${index + 1 === 3 ? '🥉' : `#${index + 1}`}`}`} ${guildId.guildName}`, value: `> High score: ${guildId.highScore}`});
    });

    // send the embed as a response
    await interaction.reply({ embeds: [embed] });
  }
};
