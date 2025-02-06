const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const Command = require("../../../Structures/Classes/BaseCommand");

class leaderboard extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDMPermission(false)
        .setDescription("View various leaderboards.")
        .addSubcommand((subCommand) => {
          return subCommand
            .setName("server")
            .setDescription("View the top ten server score.")
            .addNumberOption((num) => {
              return num
                .setName("page")
                .setRequired(false)
                .setDescription(
                  "The page on the leaderboard you would like to view."
                );
            });
        })
        .addSubcommand((subCommand) => {
          return subCommand
            .setName("user")
            .setDescription("View the top ten user score.")
            .addNumberOption((num) => {
              return num
                .setName("page")
                .setRequired(false)
                .setDescription(
                  "The page on the leaderboard you would like to view."
                );
            });
        }),
      options: {
        category: "User",
      },
    });
  }
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client
   * @param {string} lng
   */
  async execute(interaction, client, lng) {
    const subCmd = interaction.options.getSubcommand();
    const page = interaction.options.getNumber("page") || 1;
    const pageNum = 10 * page - 10;
    let index = pageNum * 10;
    let dis = "";

    const embed = new EmbedBuilder().setColor(Colors.DarkGreen).setTimestamp();

    switch (subCmd) {
      case "server":
        const gameDatas = await client.db.gameDatas.find().sort({ count: -1 });
        const guildScore = await client.db.gameDatas.findOne({
          guildId: interaction.guild.id,
        });
        const setupExist = await client.db.setupDatas.findOne({
          guildId: interaction.guild.id,
        });

        if (guildScore && setupExist) {
          const rank = gameDatas.findIndex(
            (b) => b.guildId === interaction.guild.id
          );

          dis = `${interaction.guild.name} on at **#${
            rank + 1
          }** in the leaderboard with **${guildScore.count}** score! \n`;
        } else if (guildScore && !setupExist) {
          const rank = gameDatas.findIndex(
            (b) => b.guildId === interaction.guild.id
          );

          dis = `${interaction.guild.name} on at **#${
            rank + 1
          }** in the leaderboard with **${
            guildScore.count
          }** score but counting channel is not setuped in this guild. \n`;
        } else {
          dis = `The counting channel is not setuped in this guild. Use \`setup create\` to get a position on leaderboard. \n`;
        }

        if (gameDatas.length < pageNum) {
          return await interaction.reply({
            content: `❌ Unable to find page no **${page}**.`,
          });
        }
        if (gameDatas.length >= 11) {
          embed.setFooter({
            text: `page ${page} of ${Math.ceil(gameDatas.length / 10)}`,
          });
        }

        for (const i of gameDatas.splice(pageNum, 10)) {
          dis =
            dis +
            `\n> \`${
              index + 1 === 1
                ? "🥇"
                : index + 1 === 2
                ? "🥈"
                : index + 1 === 3
                ? "🥉"
                : `#${index + 1}`
            }\`` +
            ` ${i.name}, **${i.count}**`;
          index += 1;
        }
        embed.setDescription(dis).setTitle("🏆 Server Leaderboard");

        await interaction.reply({ embeds: [embed] });

        break;
      case "user":
        const userDatas = await client.db.userDatas.find().sort({ score: -1 });
        const userScore = await client.db.userDatas.findOne({
          userId: interaction.user.id,
        });

        if (userScore) {
          const rank = userDatas.findIndex(
            (b) => b.userId === interaction.user.id
          );

          dis = `You are on at **#${rank + 1}** in the leaderboard with **${
            userScore.score
          }** score! \n`;
        } else {
          dis = ``;
        }

        if (userDatas.length < pageNum) {
          return await interaction.reply({
            content: `❌ Unable to find page no **${page}**.`,
          });
        }
        if (userDatas.length >= 11) {
          embed.setFooter({
            text: `page ${page} of ${Math.ceil(userDatas.length / 10)}`,
          });
        }
        for (const i of userDatas.splice(pageNum, 10)) {
          dis =
            dis +
            `\n> \`${
              index + 1 === 1
                ? "🥇"
                : index + 1 === 2
                ? "🥈"
                : index + 1 === 3
                ? "🥉"
                : `#${index + 1}`
            }\`` +
            ` ${i.name}, **${i.score}**`;
          index += 1;
        }
        embed.setDescription(dis).setTitle("🏆 User Leaderboard");

        await interaction.reply({ embeds: [embed] });
        break;

      default:
        break;
    }
  }
}

module.exports = leaderboard;
// async execute(interaction, client) {
//   const sub = interaction.options.getSubcommand();

//   if (sub == "score") {

//   } else if (sub == "total") {
//     const page = interaction.options.getNumber("page");

//     const guildData = await guildDatas.find().sort({ totalScore: -1 });
//     const guildScore = await guildDatas.findOne({ id: interaction.guild.id });

//     const embed = new EmbedBuilder()
//       .setTitle("🏆 Total Score Leaderboard")
//       .setColor("#2f3136")
//       .setTimestamp();

//     if (guildScore && guildScore.channelId !== "0") {
//       const rank = guildData.findIndex((b) => b.id === interaction.guild.id);

//       embed.setDescription(
//         `> ${interaction.guild.name} on at **#${
//           rank + 1
//         }** in the leaderboard with **${guildScore.totalScore}** score!`
//       );
//     }

//     if (guildScore && guildScore.channelId == "0") {
//       const rank = guildData.findIndex((b) => b.id === interaction.guild.id);

//       embed.setDescription(
//         `> ${interaction.guild.name} on at **#${
//           rank + 1
//         }** in the leaderboard with **${
//           guildScore.totalScore
//         }** score but counting channel is not setuped in this guild.`
//       );
//     }

//     if (!guildScore) {
//       embed.setDescription(
//         `The counting channel is not setuped in this guild. Use **/setchannel** to get a position on leaderboard.`
//       );
//     }

//     if (page) {
//       const pageNum = 10 * page - 10;
//       if (guildData.length < pageNum) {
//         return await interaction.reply({
//           content: `❌ Unable to find page no **${page}**.`,
//         });
//       }
//       if (guildData.length >= 11) {
//         embed.setFooter({
//           text: `page ${page} of ${Math.ceil(guildData.length / 10)}`,
//         });
//       }

//       for (const guild of guildData.splice(pageNum, 10)) {
//         const index = guildData.findIndex((b) => b.id == guild.id);
//         embed.addFields({
//           name: `${
//             index + 1 === 1
//               ? "🥇"
//               : `${
//                   index + 1 === 2
//                     ? "🥈"
//                     : `${index + 1 === 3 ? "🥉" : `#${index + 1}`}`
//                 }`
//           } ${guild.name}`,
//           value: `> Score: ${guild.totalScore}`,
//         });
//       }

//       return await interaction.reply({ embeds: [embed] });
//     }

//     if (guildData.length >= 11) {
//       embed.setFooter({
//         text: `page 1 of ${Math.ceil(guildData.length / 10)}`,
//       });
//     }

//     for (const guild of guildData.slice(0, 10)) {
//       const index = guildData.findIndex((b) => b.id == guild.id);
//       embed.addFields({
//         name: `${
//           index + 1 === 1
//             ? "🥇"
//             : `${
//                 index + 1 === 2
//                   ? "🥈"
//                   : `${index + 1 === 3 ? "🥉" : `#${index + 1}`}`
//               }`
//         } ${guild.name}`,
//         value: `> Score: ${guild.totalScore}`,
//       });
//     }
//     return await interaction.reply({ embeds: [embed] });
//   } else if (sub == "user") {
//     const page = interaction.options.getNumber("page");

//     const userData = await userDatas.find().sort({ score: -1 });
//     const userScore = await userDatas.findOne({ id: interaction.user.id });

//     const embed = new EmbedBuilder()
//       .setTitle("🏆 User Leaderboard")
//       .setColor("#2f3136")
//       .setTimestamp();

//     if (userScore) {
//       const rank = userData.findIndex((b) => b.id === interaction.user.id);

//       embed.setDescription(
//         `> ***#${rank + 1}*** **${interaction.user.username}**`
//       );
//     }

//     if (page) {
//       const pageNum = 10 * page - 10;
//       if (userData.length < pageNum) {
//         return await interaction.reply({
//           content: `❌ Unable to find page no **${page}**.`,
//         });
//       }
//       if (userData.length >= 11) {
//         embed.setFooter({
//           text: `page ${page} of ${Math.ceil(userData.length / 10)}`,
//         });
//       }

//       for (const user of userData.splice(pageNum, 10)) {
//         const index = userData.findIndex((b) => b.id == user.id);
//         embed.addFields({
//           name: `${
//             index + 1 === 1
//               ? "🥇"
//               : `${
//                   index + 1 === 2
//                     ? "🥈"
//                     : `${index + 1 === 3 ? "🥉" : `#${index + 1}`}`
//                 }`
//           } ${user.name}`,
//           value: `> Score: ${user.score}`,
//         });
//       }

//       return await interaction.reply({ embeds: [embed] });
//     }

//     if (userData.length >= 11) {
//       embed.setFooter({
//         text: `page 1 of ${Math.ceil(userData.length / 10)}`,
//       });
//     }

//     for (const user of userData.slice(0, 10)) {
//       const index = userData.findIndex((b) => b.id == user.id);
//       embed.addFields({
//         name: `${
//           index + 1 === 1
//             ? "🥇"
//             : `${
//                 index + 1 === 2
//                   ? "🥈"
//                   : `${index + 1 === 3 ? "🥉" : `#${index + 1}`}`
//               }`
//         } ${user.name}`,
//         value: `> Score: ${user.score}`,
//       });
//     }
//     return await interaction.reply({ embeds: [embed] });
//   } else if (sub == "server") {
//     const page = interaction.options.getNumber("page");

//     const guildData = await guildDatas.findOne({ id: interaction.guild.id });

//     if (!guildData) {
//       return await interaction.reply(
//         "❌ The counting channel is not setuped in this guild."
//       );
//     }

//     const userGuildData = await userGuildDatas
//       .find({ server: interaction.guild.id })
//       .sort({ score: -1 });
//     const userGuildScore = await guildDatas.findOne({
//       id: interaction.user.id,
//       server: interaction.guild.id,
//     });

//     if (!userGuildData) {
//       return await interaction.reply(`No user available in this server..`);
//     }

//     const embed = new EmbedBuilder()
//       .setTitle("🏆 Server Leaderboard")
//       .setColor("#2f3136")
//       .setTimestamp();

//     if (userGuildScore) {
//       const rank = userGuildData.findIndex(
//         (b) => b.id === interaction.user.id
//       );

//       embed.setDescription(
//         `> ***#${rank + 1}*** **${interaction.user.username}**`
//       );
//     }

//     if (page) {
//       const pageNum = 10 * page - 10;
//       if (userGuildData.length < pageNum) {
//         return await interaction.reply({
//           content: `❌ Unable to find page no **${page}**.`,
//         });
//       }
//       if (userGuildData.length >= 11) {
//         embed.setFooter({
//           text: `page ${page} of ${Math.ceil(userGuildData.length / 10)}`,
//         });
//       }

//       for (const user of userGuildData.splice(pageNum, 10)) {
//         const index = userGuildData.findIndex((b) => b.id == user.id);
//         embed.addFields({
//           name: `${
//             index + 1 === 1
//               ? "🥇"
//               : `${
//                   index + 1 === 2
//                     ? "🥈"
//                     : `${index + 1 === 3 ? "🥉" : `#${index + 1}`}`
//                 }`
//           } ${user.name}`,
//           value: `> Score: ${user.score}`,
//         });
//       }

//       return await interaction.reply({ embeds: [embed] });
//     }

//     if (userGuildData.length >= 11) {
//       embed.setFooter({
//         text: `page 1 of ${Math.ceil(userGuildData.length / 10)}`,
//       });
//     }

//     for (const user of userGuildData.slice(0, 10)) {
//       const index = userGuildData.findIndex((b) => b.id == user.id);
//       embed.addFields({
//         name: `${
//           index + 1 === 1
//             ? "🥇"
//             : `${
//                 index + 1 === 2
//                   ? "🥈"
//                   : `${index + 1 === 3 ? "🥉" : `#${index + 1}`}`
//               }`
//         } ${user.name}`,
//         value: `> Score: ${user.score}`,
//       });
//     }
//     return await interaction.reply({ embeds: [embed] });
//   } else {
//     return await interaction.reply(
//       `❌ Something went rong. **Try again letter**.`
//     );
//   }
// }
