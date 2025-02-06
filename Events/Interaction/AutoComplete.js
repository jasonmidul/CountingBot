const Event = require("../../Structures/Classes/BaseEvent");
const { Events } = require("discord.js");
const { Logger } = require("../../Structures/Functions/index");
const logger = new Logger();
const { t } = require("i18next");

class AutoComplete extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate,
    });
  }

  async execute(interaction) {
    const { client } = this;
    if (!interaction.isAutocomplete()) return;
    const autoComplete = client.autoComplete.get(interaction.commandName);
    if (!autoComplete) return;
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
      await autoComplete.execute(interaction, client, lng);
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = AutoComplete;
