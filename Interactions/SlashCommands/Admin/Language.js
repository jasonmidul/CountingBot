const Command = require("../../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { t } = require("i18next");

class Language extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("language")
        .setDescription("Set a language for this server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
          option
            .setName("language")
            .setDescription("Select a language.")
            .setRequired(true)
            .addChoices([
              { name: "English", value: "en" },
              { name: "বাংলা", value: "bn" },
              { name: "Português", value: "pt" },
            ])
        ),
      options: {
        category: "Admin",
      },
    });
  }
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client
   */
  async execute(interaction, client) {
    const lng = interaction.options.getString("language");

    const languageData = await client.db.languageDatas.findOneAndUpdate(
      { guildId: interaction.guildId },
      { lng: lng },
      { upsert: true, new: true }
    );

    await client.redis.set(
      interaction.guildId + "lng",
      JSON.stringify(languageData),
      "EX",
      60
    );

    interaction.reply({
      content: t("command:language.success", {
        lng: lng,
        data: lng == "en" ? "English" : lng == "bn" ? "বাংলা" : "Português",
        user: interaction.user.id,
      }),
    });
  }
}

module.exports = Language;
