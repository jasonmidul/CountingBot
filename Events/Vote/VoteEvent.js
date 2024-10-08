const { EmbedBuilder, Events } = require('discord.js');
const { CountingBot } = require("../../Structures/Classes/CountingBot");
const express = require('express');
const Topgg = require('@top-gg/sdk');
const userDatas = require('../../Schemas/UserSchema');
const { VoteLog } = require("../../Systems/VoteLogger");
const app = express();

const webhook = new Topgg.Webhook('vote');

module.exports = {
  name: Events.ClientReady,
  
  /**
    * @param {CountingBot} client
    */
  
  
async execute(client) {
  app.post('/vote', webhook.listener(async (vote) => {
    const userData = await userDatas.findOneAndUpdate(
      { id: vote.user },
      { $inc: { saves: 1, 'vote.count': 1, 'vote.time': new Date() } },
      { upsert: true, new: true }
    );

    let embed = new EmbedBuilder()
      .setTitle("🎁 You just voted me!")
      .setDescription(userData.saveSlot > userData.saves
        ? `> You claimed \`1\` save as vote reward! \n> You can vote [here](https://top.gg/bot/${client.config.clientId}) in every \`12h\`. \n> Now you have **${userData.saves}/${userData.saveSlot}** saves.\n> Use \`/user\` for more information.`
        : `**You vote slot is full. You need to upgrade your profile for increase your saves slote. \n\n**> You claimed noting as vote reward! \n> You can vote [here](https://top.gg/bot/${client.config.clientId}) in every \`12h\`. \n> Now you have **${userData.saves}/${userData.saveSlot}** saves.\n> Use \`/profile\` for more information.`)
      .setColor(client.color)
      .setFooter({ text: `Thanks for voting me! ❤️` })
      .setTimestamp();

    const voteUser = await client.users.fetch(vote.user);

    if (voteUser) {
      VoteLog(client, `${vote.user}`, `${voteUser.username}`);
      try {
        await voteUser.send({ embeds: [embed] });
        console.log(`[vote] Dm sent to -` + vote.user);
      } catch (err) {
        console.log(`[vote] Cant dm - ` + vote.user + err);
      }
    } else {
      VoteLog(client, `${vote.user}`, `${voteUser.username}`);
    }
  }));

  app.listen(5012); // Port
}
}