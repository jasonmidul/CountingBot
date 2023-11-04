const { Events, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { CountingBot } = require("../../Structures/Classes/CountingBot");
const botDatas = require("../../Schemas/BotSchema")

module.exports = {
  name: Events.InteractionCreate,
  
  /**
    * @param {CountingBot} client
    * @param {ChatInputCommandInteraction} interaction
    */
  
  
  async execute(interaction, client) {

    if (!interaction) return;
    if (!interaction.isChatInputCommand()) {
      return;
    } else {
      
      const botData = await botDatas.findOne({ id: '1198219530' });
      
      if (!botData) {
        await botDatas.create({ id: '1198219530' });
      };
      
      const botDa = await botDatas.findOne({ id: '1198219530' });
      
      botDa.cmdUsed += 1;
      
      botDa.save();

      const channel = await client.channels.cache.get(client.config.logChannel);
      if (interaction.guild === null) return;
      const server = interaction.guild.name;
      const user = interaction.user.username;
      const userId = interaction.user.id;

      const embed = new EmbedBuilder()
        .setTitle("⚠️ Interaction Used")
        .setColor("Blue")
        .addFields({ name: "User", value: `${user} \`${userId}\`` })
        .addFields({ name: "Command", value: `${interaction}` })
        .addFields({ name: "server id", value: `\`${interaction.guild.id}\`` })
        .setFooter({ text: server })
        .setTimestamp()

      await channel.send({ embeds: [embed] });
    }

  }
}