const Event = require("../../Structures/Classes/BaseEvent");
const { Events } = require("discord.js");
const { Logger } = require("../../Structures/Functions/index");
const logger = new Logger();
const { t } = require("i18next");

class ModalCreate extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate,
    });
  }

  async execute(interaction) {
    const { client } = this;
    if (!interaction.isModalSubmit()) return;
    const modal = client.modals.get(interaction.customId);
    if (!modal) return;
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
      await modal.execute(interaction, client, lng);
    } catch (error) {
      logger.error(error);
      if (interaction.replied) {
        await interaction.editReply({
          content: t("event.modal.fail", { lng }),
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: t("event.modal.fail", { lng }),
          ephemeral: true,
        });
      }
    }
  }
}

module.exports = ModalCreate;
