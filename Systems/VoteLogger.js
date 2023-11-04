const { CountingBot } = require("../Structures/Classes/CountingBot")
const { EmbedBuilder } = require("discord.js");
/**
 *@paem {CountingBot} client
 *@param {Staring} id
 *@param {Staring} name
 */

async function VoteLog(client, id, name) {
  
  const channel = await client.channels.cache.get(client.config.voteLog);
  
  const image = `https://top.gg/api/widget/${client.config.clientId}.svg`;

  await channel.send({
    content: `<@${id}>`,
    embeds: [
      new EmbedBuilder()
        .setTitle(`${name} Just Voted!`)
        .setImage(image)
        .setColor(client.color)
        .setTimestamp()
        .setDescription(`Thank's for voting **[Counting Bot](https://top.gg/bot/${client.config.clientId})**.`)
        .setFooter({ text: `Counting Bot - 2023`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
    ]
  })
}

module.exports = { VoteLog };