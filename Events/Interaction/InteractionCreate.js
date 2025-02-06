const Event = require("../../Structures/Classes/BaseEvent");
const { jsonFind, Logger } = require("../../Structures/Functions/index");
const { Events, InteractionType } = require("discord.js");
const logger = new Logger();
const { t } = require("i18next");

class InteractionCreate extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate,
    });
  }

  async execute(interaction) {
    const { client } = this;
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;
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

    if (
      command.options?.devOnly &&
      !jsonFind(interaction.user.id, client.config.developers)
    ) {
      return await interaction.reply({
        content: t("event.command.devOnly", {
          lng,
          client: client.user.username,
        }),
        ephemeral: true,
      });
    }

    if (
      client.config.underDevelopment &&
      !jsonFind(interaction.guild, client.config.devGuilds) &&
      !jsonFind(interaction.guild, client.config.betaTestGuilds)
    ) {
      return await interaction.reply({
        content: t("event.command.underDev", { lng }),
        ephemeral: true,
      });
    }

    try {
      await command.execute(interaction, client, lng);
    } catch (error) {
      logger.error(error);
      if (interaction.replied) {
        await interaction.editReply({
          content: t("event.command.fail", { lng }),
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: t("event.command.fail", { lng }),
          ephemeral: true,
        });
      }
    }
  }
}

module.exports = InteractionCreate;
