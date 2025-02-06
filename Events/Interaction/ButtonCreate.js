const Event = require("../../Structures/Classes/BaseEvent");
const { Events } = require("discord.js");
const { Logger } = require("../../Structures/Functions/index");
const logger = new Logger();
const { t } = require("i18next");

class ButtonCreate extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate,
    });
  }

  async execute(interaction) {
    const { client } = this;
    if (!interaction.isButton()) return;
    const button = client.buttons.get(interaction.customId);
    if (!button) return;
    const lngCach = await client.redis.get(interaction.guildId + "lng");
    let languageData;
    if (lngCach) {
      languageData = JSON.parse(lngCach);
    } else {
      languageData = await client.db.languageDatas.findOne({
        guildId: interaction.guildId,
      });
      if (!languageData && interaction.guildId !== null) {
        await client.db.languageDatas.create({
          guildId: interaction.guildId,
          lng: "en",
        });
        languageData = await client.db.languageDatas.findOne({
          guildId: interaction.guildId,
        });
      }
      await client.redis.set(
        interaction.guildId + "lng",
        JSON.stringify(languageData),
        "EX",
        60
      );
    }
    const lng = interaction.guildId == null ? "en" : languageData.lng;

    try {
      await button.execute(interaction, client, lng);
    } catch (error) {
      logger.error(error);
      if (interaction.replied) {
        await interaction.editReply({
          content: t("event.button.fail", { lng }),
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: t("event.button.fail", { lng }),
          ephemeral: true,
        });
      }
    }
  }
}

module.exports = ButtonCreate;
