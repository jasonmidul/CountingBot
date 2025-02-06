const { EmbedBuilder, Colors } = require("discord.js");
const { t } = require("i18next");

class ResolveMassages {
  constructor(res) {
    this.lng = res.lng;
    this.counter = res.counter;
    this.count = res.count;
    this.userSaves = res.userSaves;
    this.guildSaves = res.guildSaves;
    this.reason = res.output;
    this.message = res.msg;
  }
  async sendMessage() {
    const lng = this.lng;
    const user = this.counter;
    const nextNum = this.count;
    const message = this.message;
    const embed = new EmbedBuilder().setColor(Colors.Yellow);

    switch (this.reason) {
      case "rongUseUserSave":
        await message.channel.send(
          t("event.counting.userSaveUseW", {
            lng,
            user,
            nextNum,
            leftSave: this.userSaves - 1,
            totalSave: this.userSaves,
          })
        );
        break;
      case "B2BUseUserSave":
        await message.channel.send(
          t("event.counting.userSaveUseB2B", {
            lng,
            user,
            nextNum,
            leftSave: this.userSaves - 1,
            totalSave: this.userSaves,
          })
        );
        break;
      case "rongGuildUserSave":
        await message.channel.send(
          t("event.counting.guildSaveUseW", {
            lng,
            user,
            nextNum,
            leftSave: this.guildSaves - 1,
            totalSave: this.guildSaves,
          })
        );
        break;
      case "B2BUseUserSave":
        await message.channel.send(
          t("event.counting.guildSaveUseB2B", {
            lng,
            user,
            nextNum,
            leftSave: this.guildSaves - 1,
            totalSave: this.guildSaves,
          })
        );
        break;
      case "RongFail":
        embed.setDescription(
          t("event.counting.embed.des", {
            lng,
            link: "https://top.gg/bot/1293072781491044415/vote",
          })
        );
        await message.channel.send({
          content: t("event.counting.wrongNum", {
            lng,
            user,
            breakAt: this.count - 1,
          }),
          embeds: [embed],
        });
        break;
      case "B2BFail":
        embed.setDescription(
          t("event.counting.embed.des", {
            lng,
            link: "https://top.gg/bot/1293072781491044415/vote",
          })
        );
        await message.channel.send({
          content: t("event.counting.B2BCount", {
            lng,
            user,
            breakAt: this.count - 1,
          }),
          embeds: [embed],
        });
        break;
      case "warning":
        const msg = await message.channel.send(
          t("event.counting.startCount", {
            lng,
            user,
          })
        );

        setTimeout(() => {
          msg.delete();
        }, 3_000);
        break;
      default:
        break;
    }
  }
}
module.exports = { ResolveMassages };
