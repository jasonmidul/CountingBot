const { CountingBot } = require("../Structures/Classes/CountingBot")
const { EmbedBuilder } = require("discord.js");
/**
 *@paem {CountingBot} client
 *@param {Staring} id
 *@param {Staring} name
 */

async function VoteLog(client, id, name) {
  const channel = client.channels.cache.get(client.config.voteLog);
  const image = `https://top.gg/api/widget/${client.config.clientId}.svg`;
  const embed = {
    content: `<@${id}>`,
    embeds: [{
      title: `${name} Just Voted!`,
      image: { url: image },
      color: client.color,
      timestamp: new Date(),
      description: `Thank's for voting **[Counting Bot](https://top.gg/bot/${client.config.clientId})**.`,
      footer: { text: 'Counting Bot - 2023', iconURL: client.user.displayAvatarURL({ dynamic: true })}
    }]
  };
  await channel.send(embed);
}

module.exports = { VoteLog };