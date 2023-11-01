const { Client, Message, EmbedBuilder, Events, PermissionFlagsBits } = require(`discord.js`);
const guildDatas = require('../../schemas/guild');
const userDatas = require('../../schemas/ban');
const math = require('mathjs');


module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Message} interaction
   * @param {Client} client
   */
  async execute(message) {

    //filter dm
    if (message.guild === null) return;
    //find data
    const guildData = await guildDatas.findOne({ guildId: message.guild.id });
    //return if no data
    if (!guildData) return;
    //channel define
    let countchannel = guildData.countChannel;

    if (message.channel.id !== countchannel) return;
    //filter bot
    if (message.author.bot) return;

    //filter text
    try {
      const mathCon = math.evaluate(`${message.content}`);
      const number = parseInt(mathCon);

      if (isNaN(number) && guildData.countOnly == 'true') {
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
          return message.delete();
        } else {
          return message.reply(`Number only is **enabled** in this guild but i don't have permissions to delete this message! `);
        }
      }
      if (isNaN(number)) {
        return;
      }
    } catch (error) {
      if (guildData.countOnly == 'true') {
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
          return message.delete();
        } else {
          return message.reply(`Number only is **enabled** in this guild but i don't have permissions to delete this message! `);
        }
      }
      return;
    };

    const mathCon = math.evaluate(`${message.content}`);
    const number = parseInt(mathCon);

    if (!message.member.roles.cache.has(guildData.counterRole)) {
      message.delete();
      return;
    }

    //ban user
    const userData = await userDatas.findOne({
      guildId: message.guild.id,
      userId: message.author.id
    });
    if (userData) {
      message.delete();
      return;
    }
    //reaction
    let reaction = "";

    if (guildData.lastScore > 98) {
      reaction = '✅'
    } else if (guildData.lastScore > 48) {
      reaction = '☑️'
    } else {
      reaction = '✅'
    }


    //count alone
    if (message.author.id === guildData.lastUser) {

      const msg = await message.reply({ content: `**YOU RUINED THE GAME AT ${guildData.lastScore + 1}!** \nStart counting from \`1\`. **You Can't Count Alone!!**`, embeds: [embed2] })
      guildData.lastScore = 0;
      guildData.lastUser = ' ';

      try {
        message.react('❌')
      } catch (err) {

      }
    } else {
      //counter start
      if (number > 1 && guildData.lastScore === 0 || number < 1 && guildData.lastScore === 0) {
        const msg = await message.reply({ content: `**Start counting from 1.**` })
        message.react('⚠')
        setTimeout(() => {
          try {
            msg.delete();
          } catch (err) {

          }
        }, 10000)
        //filter rong
      } else if (number < guildData.lastScore + 1 || number > guildData.lastScore + 1) {

        const msg = await message.reply({ content: `**YOU RUINED THE GAME AT ${guildData.lastScore + 1}!** \nStart counting from \`1\`. \n **Rong Number!!**`, embeds: [embed2] })
        guildData.lastScore = 0;
        guildData.lastUser = ' ';

        try {
          message.react('❌')
        } catch (err) {

        }
        //successfull
      } else if (number - 1 == guildData.lastScore) {

        guildData.lastScore += 1;

        try {
          message.react(`${reaction}`)
        } catch (err) {

        }

        guildData.guildName = message.guild.name;
        guildData.lastUser = message.author.id;
      }

    }

    if (guildData.highScore < guildData.lastScore) {
      guildData.highScore = guildData.lastScore;
    };

    guildData.save();
  }
}
