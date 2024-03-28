const { EmbedBuilder, Events, PermissionFlagsBits } = require(`discord.js`);
const guildDatas = require('../../Schemas/GuildSchema');
const userDatas = require('../../Schemas/UserSchema');
const botDatas = require('../../Schemas/BotSchema');
const userGuildDatas = require("../../Schemas/UserGuildSchema");
const { filterContent } = require("../../Systems/CountFilter");

module.exports = {
  name: Events.MessageCreate,
async execute(message) {
  if (!message.guild) return;

  const guildData = await GuildData.findOne({ id: message.guild.id });
  if (!guildData || message.channel.id !== guildData.channelId || message.author.bot) return;

  const userData = await UserData.findOne({ id: message.author.id });
  if (!userData) await UserData.create({ id: message.author.id, name: message.author.username });

  const userGuildData = await UserGuildData.findOne({ id: message.author.id, server: message.guild.id });
  if (!userGuildData) await UserGuildData.create({ id: message.author.id, server: message.guild.id, name: message.author.username });

  const botData = await BotData.findOne({ id: '1198219530' });

  const math = filterContent(message, guildData, userData);

  if (math === 'one' && guildData.numOnly && message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return message.delete();
  } else if (math === 'two' || math === 'three') {
    message.react(guildData.reaction.saves);
    let isGuildSave = math === 'three';
    message.channel.send({ content: `<@${message.author.id}> ⛑️ You have used **1** of ${isGuildSave ? 'guild' : 'your'} saves. You have ${isGuildSave ? guildData.saves : userData.saves - 1} left. The next number is **${guildData.score + 1}!**.` });
    if (isGuildSave) {
      userGuildData.count.rong += 1;
      userGuildData.saveUsed += 1;
      guildData.saves -= 1;
      guildData.count.rong += 1;
    } else {
      userData.saves -= 1;
      userData.count.rong += 1;
    }
  } else if (math === 'four') {
    const embed = new EmbedBuilder().setDescription(`Vote [here](https://top.gg/bot/1106236979147964426/vote) to earn saves so you can continue counting next time. See /rules.`).setColor('#2f3136');
    message.react(guildData.reaction.rong);
    message.channel.send({ content: `<@${message.author.id}> RUINED IT AT **${guildData.score}**!! Next number is **1**. **You can't count two numbers in a row.**`, embeds: [embed] });
    userGuildData.count.rong += 1;
    userData.count.rong += 1;
    botData.count.rong += 1;
    guildData.count.rong += 1;
    guildData.score = 0;
    guildData.lastUser = 'None';
  } else if (math === 'five') {
    message.react(guildData.reaction.warn);
    const msg = await message.channel.send(`<@${message.author.id}> You need to start counting from 1.`);
    setTimeout(() => {
      msg.delete();
    }, 7000);
  } else if (math === 'six') {
    const embed = new EmbedBuilder().setDescription(`Vote [here](https://top.gg/bot/1106236979147964426/vote) to earn saves so you can continue counting next time. See /rules.`).setColor('#2f3136');
    message.react(guildData.reaction.rong);
    message.channel.send({ content: `<@${message.author.id}> RUINED IT AT **${guildData.score}**!! Next number is **1**. **Rong Number.**`, embeds: [embed] });
    userGuildData.count.rong += 1;
    botData.count.rong += 1;
    userData.count.rong += 1;
    guildData.count.rong += 1;
    guildData.lastUser = 'None';
    guildData.score = 0;
  } else if (math === 'seven') {
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
  }

  await Promise.all([guildData.save(), userData.save(), botData.save(), userGuildData.save()]);
}
}