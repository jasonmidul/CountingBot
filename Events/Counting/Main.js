const { EmbedBuilder, Events, PermissionFlagsBits } = require(`discord.js`);
const guildDatas = require('../../Schemas/GuildSchema');
const userDatas = require('../../Schemas/UserSchema');
const botDatas = require('../../Schemas/BotSchema');
const userGuildDatas = require("../../Schemas/UserGuildSchema");
const { filterContent } = require("../../Systems/CountFilter");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {

    if (message.guild === null) return;

    const guildData = await guildDatas.findOne({
      id: message.guild.id
    });

    if (!guildData) return;

    if (message.channel.id !== guildData.channelId) return;

    if (message.author.bot) return;

    const userData = await userDatas.findOne({
      id: message.author.id
    });

    if (!userData) {
      userDatas.create({
        id: message.author.id,
        name: message.author.username
      })
    }

    const userGuildData = await userGuildDatas.findOne({
      id: message.author.id,
      server: message.guild.id
    });

    if (!userGuildData) {
      userGuildDatas.create({
        id: message.author.id,
        server: message.guild.id,
        name: message.author.username
      })
    }

    if (guildData.countRole.on == true && !message.member.roles.cache.has(guildData.countRole.id) && message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {

      return message.delete();

    };

    if (guildData.countRole.on == true && !message.member.roles.cache.has(guildData.countRole.id) && !message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.react(guildData.reaction.warn);
    };

    const botData = await botDatas.findOne({ id: '1198219530' });

    const math = filterContent(message, guildData, userData);

    if (math == 'one') {
      if (guildData.numOnly == true) {
        if (message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
          return message.delete();
        } else {
          message.channel.send('Number Only setting has beed disabled because **I dont have ManageMessages permission in this channel**.')
          guildData.numOnly = false;
        }
      } else {
        return;
      }
    } else if (math == 'two') {

      message.react(guildData.reaction.saves);

      message.channel.send({ content: `<@${message.author.id}> ⛑️ You have used **1** of your saves. You have ${userData.saves - 1} left. The next number is **${guildData.score + 1}!**.` });

      userData.saves -= 1;
      userData.count.rong += 1;

      userGuildData.saveUsed += 1;
      userGuildData.count.rong += 1;

      guildData.count.rong += 1;

    } else if (math == 'three') {

      message.react(guildData.reaction.saves);

      message.channel.send({ content: `<@${message.author.id}> ⛑️ You have used **1** of guild saves. Guild have ${guildData.saves} left. The next number is **${guildData.score + 1}!**.` });

      userGuildData.count.rong += 1;
      userGuildData.saveUsed += 1;

      guildData.saves -= 1;
      guildData.count.rong += 1;

      userData.count.rong += 1;

    } else if (math == 'four') {

      const embed = new EmbedBuilder()
        .setDescription(`Vote [here](https://top.gg/bot/1106236979147964426/vote) to earn saves so you can continue counting next time. See /rules.`)
        .setColor('#2f3136')

      message.react(guildData.reaction.rong);

      message.channel.send({ content: `<@${message.author.id}> RUINED IT AT **${guildData.score}**!! Next number is **1**. **You can't count two numbers in a raw.**`, embeds: [embed] });

      userGuildData.count.rong += 1;

      userData.count.rong += 1;

      botData.count.rong += 1;

      guildData.count.rong += 1;
      guildData.score = 0;
      guildData.lastUser = `None`;

    } else if (math == 'five') {

      message.react(guildData.reaction.warn);

      const msg = await message.channel.send(`<@${message.author.id}> You need to start counting from 1.`);

      setTimeout(() => {
        msg.delete();
      }, 7000)

    } else if (math == 'six') {

      const embed = new EmbedBuilder()
        .setDescription(`Vote [here](https://top.gg/bot/1106236979147964426/vote) to earn saves so you can continue counting next time. See /rules.`)
        .setColor('#2f3136')

      message.react(guildData.reaction.rong);

      message.channel.send({ content: `<@${message.author.id}> RUINED IT AT **${guildData.score}**!! Next number is **1**. **Rong Number.**`, embeds: [embed] });

      userGuildData.count.rong += 1;

      botData.count.rong += 1;

      userData.count.rong += 1;

      guildData.count.rong += 1;
      guildData.lastUser = `None`;
      guildData.score = 0;

    } else if (math == 'seven') {

      message.react(guildData.reaction.right);

      userGuildData.name = message.author.username;
      userGuildData.count.right += 1;
      userGuildData.score += 1;

      guildData.score += 1;
      guildData.lastUser = message.author.id;
      guildData.name = message.guild.name;
      guildData.totalScore += 1;
      guildData.count.right += 1;

      userData.count.right += 1;
      userData.score += 1;
      userData.name = message.author.username;
      
      botData.count.right += 1;

    }

    if (guildData.highScore < guildData.score) {
      guildData.highScore = guildData.score;
    };

    guildData.save();
    userData.save();
    botData.save();
    userGuildData.save();

  }
}