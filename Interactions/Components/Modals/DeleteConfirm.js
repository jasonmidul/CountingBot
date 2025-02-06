const Component = require("../../../Structures/Classes/BaseComponent");
const { EmbedBuilder, Colors } = require("discord.js");

class Redeem extends Component {
  constructor(client) {
    super(client, {
      id: "setup-delete",
    });
  }
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client
   * @param {string} lng
   */
  async execute(interaction, client, lng) {
    const input = interaction.fields.getTextInputValue("confirm");
    if (input !== "confirm")
      return await interaction.reply({
        content: "> Setup deletion failed. You entered rong value.",
      });
    const setupData = await client.db.setupDatas.findOne({
      guildId: interaction.guild.id,
    });
    const embed = new EmbedBuilder()
      .setColor(Colors.DarkGreen)
      .setDescription(
        `\`✅\` The counting channel **(**<#${setupData.setupChannel}>**)** has removed from this guild.`
      );
    await client.db.setupDatas.findOneAndDelete({
      guildId: interaction.guild.id,
    });
    await client.redis.del(interaction.guildId + "setup");

    const updateGame = await client.db.gameDatas.findOneAndUpdate(
      { guildId: interaction.guildId },
      {
        count: 0,
        lastCounter: "none",
      },
      { upsert: true, new: true }
    );
    await client.redis.set(
      this.guildId + "game",
      JSON.stringify(updateGame),
      "EX",
      60
    );
    await interaction.reply({ embeds: [embed] });
  }
}

module.exports = Redeem;
