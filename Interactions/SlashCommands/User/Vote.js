const Command = require("../../../Structures/Classes/BaseCommand");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { t } = require("i18next");

class Vote extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("To vote Bettel Counter!")
        .setDMPermission(false),
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
    const userData = await client.db.userDatas.findOne({
      userId: interaction.user.id,
    });
    if (!userData) {
      client.db.userDatas.create({
        userId: vote.user,
      });
      userData = await client.db.userDatas.findOne({
        userId: vote.user,
      });
    }
    const voteMs = 1000 * 60 * 60 * 12;
    const resolve = new Date() - userData.vote.time;
    const embed = new EmbedBuilder().setColor(Colors.DarkGreen);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Vote Bettel Counter")
        .setURL(client.config.voteUrl)
        .setStyle(ButtonStyle.Link)
    );

    if (resolve < voteMs) {
      const remainingTimeHours = Math.floor(
        (voteMs - resolve) / (1000 * 60 * 60)
      );
      const remainingTimeMinutes = Math.floor(
        ((voteMs - resolve) % (1000 * 60 * 60)) / (1000 * 60)
      );

      embed.setDescription(
        `**You have alrady voted.** \n\n> You can vote after **${remainingTimeHours}** hour, **${remainingTimeMinutes}** minute.`
      );
      await interaction.reply({ embeds: [embed], components: [row] });
    } else {
      embed.setDescription(
        `**Your vote is available.** \n\n> Vote now by click **[here](https://top.gg/bot/1106236979147964426/vote)**!`
      );
      await interaction.reply({ embeds: [embed], components: [row] });
    }
  }
}

module.exports = Vote;
