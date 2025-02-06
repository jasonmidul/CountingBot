const Command = require("../../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { t } = require("i18next");

class Stats extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("To check server, user, bot counting stats!")
        .setDMPermission(false)
        .addSubcommand((subCommand) =>
          subCommand
            .setName("server")
            .setDescription("To check server counting stats!")
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("user")
            .setDescription("To check user counting stats!")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("Select a user to view user stats.")
                .setRequired(false)
            )
        ),
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
    let embed = new EmbedBuilder()
      .setColor(Colors.DarkGreen)
      .setTimestamp()
      .setFooter({ text: "Bettel Counter - 2024" });

    switch (subCmd) {
      case "server":
        const gameData = await client.db.gameDatas.findOne({
          guildId: interaction.guild.id,
        });

        if (!gameData) {
          return interaction.reply({
            content: "No data found for this server.",
            ephemeral: true,
          });
        }

        const setupData = await client.db.setupDatas.findOne({
          guildId: interaction.guild.id,
        });
        let setupStats = "> Counting Channel: **Not setup yet!**";
        if (setupData) {
          setupStats = `> Counting Channel: <#${setupData.setupChannel}> \n> Math Calculate: **${setupData.math}** \n> Number Only: **${setupData.numOnly}**`;
        }
        const totalCount = gameData.totalCount.right + gameData.totalCount.rong;
        const cranks = await client.db.gameDatas.find().sort({ count: -1 });
        const crank = cranks.findIndex(
          (b) => b.guildId === interaction.guild.id
        );
        const hranks = await client.db.gameDatas
          .find()
          .sort({ highestCount: -1 });
        const hrank = hranks.findIndex(
          (b) => b.guildId === interaction.guild.id
        );
        embed.setTitle("Server Counting Stats");
        embed.setDescription(
          `> Current Count: **${gameData.count}** (**#${
            crank + 1
          }**) \n> Highest Count: **${gameData.highestCount}** (**#${
            hrank + 1
          }**) \n> Total Count: **${totalCount}** \n> Correct Rate: **${(
            (gameData.totalCount.right / totalCount) *
            100
          ).toFixed(2)}%** \n> Last Counter: <@${
            gameData.lastCounter
          }> \n> Server Saves: **${gameData.saves}/${
            gameData.saveSlot
          }** \n${setupStats}`
        );
        await interaction.reply({
          embeds: [embed],
        });
        break;
      case "user":
        const user =
          (await interaction.options.getMember("user")?.user) ||
          interaction.user;
        const userData = await client.db.userDatas.findOne({
          userId: user.id,
        });

        if (!userData) {
          return interaction.reply({
            content: "No data found for this user.",
            ephemeral: true,
          });
        }
        const totalUserCount = userData.count.right + userData.count.rong;
        embed.setTitle(user.username).addFields({
          name: "Global Stats",
          value: `> Total Count: **${totalUserCount}** \n> Correct Rate: **${(
            (userData.count.right / totalUserCount) *
            100
          ).toFixed(2)}%** \n> Correct(\`✅\`): **${
            userData.count.right
          }** \n> Wrong(\`❌\`): **${userData.count.rong}** \n> Score: **${
            userData.score
          }** \n> User Saves: **${userData.saves}/${userData.saveSlot}** `,
          inline: true,
        });
        await interaction.reply({
          embeds: [embed],
        });
        break;
      default:
        break;
    }
  }
}

module.exports = Stats;
