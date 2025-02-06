const Event = require("../../Structures/Classes/BaseEvent");
const {
  Events,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const { Logger } = require("../../Structures/Functions/index");
const { CountingResolver } = require("../../CountingLogics/CountingResolver");
const logger = new Logger();
const { t } = require("i18next");

class CountingEvent extends Event {
  constructor(client) {
    super(client, {
      name: Events.MessageCreate,
    });
  }

  async execute(message) {
    if (message.guild === null) return;
    const { client } = this;
    const db = client.db;

    const setupCach = await client.redis.get(message.guild.id + "setup");
    let setupData;
    if (setupCach) {
      setupData = JSON.parse(setupCach);
    } else {
      setupData = await db.setupDatas.findOne({
        guildId: message.guild.id,
      });
      if (setupData) {
        await client.redis.set(
          message.guild.id + "setup",
          JSON.stringify(setupData),
          "EX",
          60
        );
      }
    }

    if (!setupData || message.channel.id !== setupData.setupChannel) return;
    const lngCach = await client.redis.get(message.guild.id + "lng");
    let languageData;
    if (lngCach) {
      languageData = JSON.parse(lngCach);
    } else {
      languageData = await db.languageDatas.findOne({
        guildId: message.guild.id,
      });
      if (!languageData && message.guild.id !== null) {
        await db.languageDatas.create({
          guildId: message.guild.id,
          lng: "en",
        });
        languageData = await db.languageDatas.findOne({
          guildId: message.guild.id,
        });
      }
      await client.redis.set(
        message.guild.id + "lng",
        JSON.stringify(languageData),
        "EX",
        60
      );
    }
    const lng = message.guild.id == null ? "en" : languageData.lng;
    if (message.author.id == client.user.id) return;
    if (message.author.bot) {
      if (setupData.numOnly == true) {
        if (
          message.guild.members.me.permissions.has(
            PermissionFlagsBits.ManageMessages
          )
        ) {
          setTimeout(() => {
            message.delete();
          }, 2_000);
          return;
        } else {
          setupData.numOnly = false; //need up here dhjdjhdjdtjdgj
          message.channel.send(
            t("event.counting.numOnlyDisable", {
              lng,
            })
          );
        }
      } else return;
    }
    const gameCach = await client.redis.get(message.guild.id + "game");
    let gameData;
    if (gameCach) {
      gameData = JSON.parse(gameCach);
    } else {
      gameData = await db.gameDatas.findOne({
        guildId: message.guild.id,
      });
    }
    const botCach = await client.redis.get("jasonmidul");
    let botData;
    if (botCach) {
      botData = JSON.parse(botCach);
    } else {
      botData = await db.botDatas.findOne({ password: "jasonmidul" });
    }
    const userCach = await client.redis.get(message.author.id + "user");
    let userData;
    if (userCach) {
      userData = JSON.parse(userCach);
    } else {
      userData = await db.userDatas.findOne({
        userId: message.author.id,
      });
    }

    if (!userData) {
      await db.userDatas.create({
        userId: message.author.id,
        saves: 2,
        vote: {
          count: 2,
        },
      });
      userData = await db.userDatas.findOne({
        userId: message.author.id,
      });
    }
    const game = new CountingResolver(
      message,
      setupData,
      gameData,
      userData,
      botData,
      lng,
      client
    );
    game.messageConvart();
    if (!game.value) {
      if (game.numOnly == true) {
        if (
          message.guild.members.me.permissions.has(
            PermissionFlagsBits.ManageMessages
          )
        ) {
          setTimeout(() => {
            message.delete();
          }, 5_000);
          return;
        } else {
          setupData.numOnly = false;
          setupData.save();
          message.channel.send(
            t("event.counting.numOnlyDisable", {
              lng,
            })
          );
        }
      } else return;
    }
    try {
      game.countResolve();
      game.react();
      game.updateDB();
      game.sendMessage();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CountingEvent;
