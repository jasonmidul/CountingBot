const { EmbedBuilder, Colors } = require("discord.js");

async function voteLog(client, id, name) {
  const channel = await client.channels.cache.get(client.config.voteLog);

  const image = `https://top.gg/api/widget/${client.config.clientId}.png`;

  await channel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle(`${name} Just Voted!`)
        .setImage(image)
        .setColor(Colors.DarkGreen)
        .setTimestamp()
        .setDescription(
          `Thank's for voting **[Counting Bot](${client.config.voteUrl})**.`
        )
        .setFooter({
          text: `Counting Bot - 2024`,
        }),
    ],
  });
}

module.exports = { voteLog };
