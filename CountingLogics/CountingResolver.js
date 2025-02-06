const { ResolveMassages } = require("./ResolveMessages");
const math = require("mathjs");

const reaction = {
  success: "✅",
  fail: "❌",
  save: "⛑️",
  warn: "⚠️",
};

class CountingResolver {
  constructor(message, setupData, gameData, userData, botData, lng, client) {
    this.msg = message;
    this.message = message.content;
    this.counter = message.author.id;
    this.guildId = message.guild.id;
    this.channelId = message.channel.id;
    this.lng = lng;
    this.math = setupData.math;
    this.numOnly = setupData.numOnly;
    this.guildSaves = gameData.saves;
    this.lastCounter = gameData.lastCounter;
    this.count = gameData.count + 1;
    this.userSaves = userData.saves;
    this.highestCount = gameData.highestCount;
    this.reaction = gameData.reaction;
    this.gameData = gameData;
    this.userData = userData;
    this.botData = botData;
    this.client = client;
  }
  messageConvart() {
    let count = this.message.replace(/\*\*|~~|__|_|\\/g, "").split(" ")[0];

    if (count == "") return;
    if (this.math == true) {
      try {
        count = math.evaluate(count);
      } catch (error) {
        return;
      }
    }
    this.value = Number(count);
  }
  countResolve() {
    if (this.counter !== this.lastCounter && this.count == this.value) {
      this.output = "success";
    }
    if (
      this.value !== this.count &&
      this.userSaves >= 1 &&
      this.counter !== this.lastCounter
    )
      this.output = "rongUseUserSave";
    if (
      this.value !== this.count &&
      this.counter !== this.lastCounter &&
      this.guildSaves >= 1 &&
      this.userSaves <= 1
    )
      this.output = "rongUseGuildSave";
    if (
      this.value !== this.count &&
      this.userSaves < 1 &&
      this.guildSaves < 1 &&
      this.counter !== this.lastCounter
    )
      this.output = "RongFail";
    if (this.counter == this.lastCounter && this.userSaves >= 1)
      this.output = "B2BUseUserSave";
    if (
      this.counter == this.lastCounter &&
      this.guildSaves >= 1 &&
      this.userSaves <= 1
    )
      this.output = "B2BUseGuildSave";
    if (
      this.counter == this.lastCounter &&
      this.userSaves < 1 &&
      this.guildSaves < 1
    )
      this.output = "B2BFail";
    if (this.count == 1 && this.value !== this.count) this.output = "warning";
  }
  sendMessage() {
    const msg = new ResolveMassages(this);
    msg.sendMessage();
  }
  react() {
    switch (this.output) {
      case "success":
        if (this.highestCount < this.value) {
          this.msg.react("🏆");
        } else this.msg.react(this.reaction.success);
        break;
      case "rongUseUserSave":
      case "rongGuildUserSave":
      case "B2BUseUserSave":
      case "B2BUseUserSave":
        this.msg.react(this.reaction.save);
        break;
      case "RongFail":
      case "B2BFail":
        this.msg.react(this.reaction.fail);
        break;
      case "warning":
        this.msg.react(this.reaction.warn);
        break;
      default:
        break;
    }
  }
  async updateDB() {
    const db = this.client.db;
    let updateUser;
    let updateGame;
    let updateBot;
    switch (this.output) {
      case "success":
        updateUser = await db.userDatas.findOneAndUpdate(
          { userId: this.counter },
          {
            score: this.userData.score + 1,
            name: this.msg.author.username,
            "count.right": this.userData.count.right + 1,
          },
          { upsert: true, new: true }
        );
        await this.client.redis.set(
          this.counter + "user",
          JSON.stringify(updateUser),
          "EX",
          60
        );

        updateGame = await db.gameDatas.findOneAndUpdate(
          { guildId: this.guildId },
          {
            name: this.msg.guild.name,
            count: this.count,
            lastCounter: this.counter,
            "totalCount.right": this.gameData.totalCount.right + 1,
            highestCount:
              this.highestCount < this.value
                ? this.gameData.count
                : this.highestCount,
          },
          { upsert: true, new: true }
        );
        await this.client.redis.set(
          this.guildId + "game",
          JSON.stringify(updateGame),
          "EX",
          60
        );
        updateBot = await db.botDatas.findOneAndUpdate(
          { password: "jasonmidul" },
          { count: this.botData.count + 1 },
          { upsert: true, new: true }
        );
        await this.client.redis.set(
          "jasonmidul",
          JSON.stringify(updateBot),
          "EX",
          60
        );

        break;
      case "rongUseUserSave":
      case "B2BUseUserSave":
        updateUser = await db.userDatas.findOneAndUpdate(
          { userId: this.counter },
          {
            score: this.userData.score - 1,
            saves: this.userData.saves - 1,
            "count.rong": this.userData.count.rong + 1,
          },
          { upsert: true, new: true }
        );
        await this.client.redis.set(
          this.counter + "user",
          JSON.stringify(updateUser),
          "EX",
          60
        );
        updateGame = await db.gameDatas.findOneAndUpdate(
          { guildId: this.guildId },
          {
            "totalCount.rong": this.gameData.totalCount.rong + 1,
          },
          { upsert: true, new: true }
        );
        await this.client.redis.set(
          this.guildId + "game",
          JSON.stringify(updateGame),
          "EX",
          60
        );
        break;
      case "rongGuildUserSave":
      case "B2BUseUserSave":
        updateUser = await db.userDatas.findOneAndUpdate(
          { userId: this.counter },
          {
            score: this.userData.score - 1,
            "count.rong": this.userData.count.rong + 1,
          },
          { upsert: true, new: true }
        );
        await this.client.redis.set(
          this.counter + "user",
          JSON.stringify(updateUser),
          "EX",
          60
        );
        updateGame = await db.gameDatas.findOneAndUpdate(
          { guildId: this.guildId },
          {
            "totalCount.rong": this.gameData.totalCount.rong + 1,
            saves: this.gameData.saves - 1,
          },
          { upsert: true, new: true }
        );
        await this.client.redis.set(
          this.guildId + "game",
          JSON.stringify(updateGame),
          "EX",
          60
        );

        break;
      case "RongFail":
      case "B2BFail":
        updateUser = await db.userDatas.findOneAndUpdate(
          { userId: this.counter },
          {
            score: 0,
            "count.rong": this.userData.count.rong + 1,
          },
          { upsert: true, new: true }
        );
        await this.client.redis.set(
          this.counter + "user",
          JSON.stringify(updateUser),
          "EX",
          60
        );
        updateGame = await db.gameDatas.findOneAndUpdate(
          { guildId: this.guildId },
          {
            count: 0,
            lastCounter: "none",
            "totalCount.rong": this.gameData.totalCount.rong + 1,
          },
          { upsert: true, new: true }
        );
        await this.client.redis.set(
          this.guildId + "game",
          JSON.stringify(updateGame),
          "EX",
          60
        );
        break;
      default:
        break;
    }
  }
}

module.exports = { CountingResolver };
