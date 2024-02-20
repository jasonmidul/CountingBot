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
  if (!interaction || !interaction.isChatInputCommand()) {
    return;
  }

  let botDa = await botDatas.findOneAndUpdate({ id: '1198219530' }, { $inc: { cmdUsed: 1 } }, { upsert: true, new: true });

  const channel = client.channels.cache.get(client.config.logChannel);
  if (!interaction.guild) return;
  
  const { name, id } = interaction.user;
  const server = interaction.guild.name;
  
  const embed = new EmbedBuilder()
    .setTitle("⚠️ Interaction Used")
    .setColor("Blue")
    .addFields(
      { name: "User", value: `${name} \`${id}\`` },
      { name: "Command", value: `${interaction}` },
      { name: "server id", value: `\`${interaction.guild.id}\`` }
    )
    .setFooter(server)
    .setTimestamp();

  await channel.send({ embeds: [embed] });
}
}