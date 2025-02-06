const Event = require("../../Structures/Classes/BaseEvent");
const { voteLog } = require("../../Structures/Functions/index");
const { Logger } = require("../../Structures/Functions/index");

const logger = new Logger();
const express = require("express");
const Topgg = require("@top-gg/sdk");

const app = express();
const webhook = new Topgg.Webhook("vote");

const { Events, EmbedBuilder, Colors } = require("discord.js");

class VoteReward extends Event {
  constructor(client) {
    super(client, {
      name: Events.ClientReady,
    });
  }

  async execute(client) {
    app.post(
      "/vote",
      webhook.listener(async (vote) => {
        let userData = await client.db.userDatas.findOne({
          userId: vote.user,
        });

        let embed = new EmbedBuilder();
        if (!userData) {
          client.db.userDatas.create({
            userId: vote.user,
          });
          userData = await client.db.userDatas.findOne({
            userId: vote.user,
          });
        }
        if (userData.saveSlot > userData.saves) {
          userData.saves += 1;
          userData.vote.count += 1;
          userData.vote.time = new Date();
          userData.save();

          embed
            .setTitle("🎁 You just voted me!")
            .setDescription(
              `**You claimed** \`1\` **save as vote reward!** \n> You can vote [here](${client.config.voteUrl}) in every \`12h\`. \n> Now you have **${userData.saves}/${userData.saveSlot}** saves.\n> Use \`/profile\` for more information.`
            )
            .setColor(Colors.DarkGreen)
            .setFooter({ text: `Thanks for voting me! ❤️` })
            .setTimestamp();
        } else {
          userData.vote.count += 1;
          userData.vote.time = new Date();
          userData.save();

          embed
            .setTitle("🎁 You just voted me!")
            .setDescription(
              `**You vote slot is full. You need to upgrade your profile for increase your saves slote.**\n> You claimed noting as vote reward! \n> You can vote [here](https://top.gg/bot/${client.config.clientId}) in every \`12h\`. \n> Now you have **${userData.saves}/${userData.saveSlot}** saves.\n> Use \`/profile\` for more information.`
            )
            .setColor(Colors.DarkGreen)
            .setFooter({ text: `Thanks for voting me! ❤️` })
            .setTimestamp();
        }
        const voteUser = await client.users.fetch(vote.user);
        voteLog(client, `${vote.user}`, `${voteUser.username}`);

        if (voteUser) {
          try {
            await voteUser.send({ embeds: [embed] });

            logger.info(`Dm sent to - ` + vote.user);
          } catch (err) {
            logger.info(`Cant dm - ` + vote.user + err);
          }
        }
      })
    );

    app.listen(6017);
  }
}

module.exports = VoteReward;
