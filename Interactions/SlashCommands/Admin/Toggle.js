const Command = require("../../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { t } = require("i18next");

class Toggle extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("toggle")
        .setDescription("🔑 Toggle different setting for counting game.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting to toggle.")
            .setRequired(true)
            .addChoices(
              {
                name: "Math Calculate - if true the bot game will calculate maths in counting channel.",
                value: "math",
              },
              {
                name: "Number Only - if true bot will delete all normal messages from counting channel.",
                value: "numOnly",
              }
            )
        )
        .addBooleanOption((option) =>
          option
            .setName("status")
            .setDescription("Whether to toggle true or false.")

            .setRequired(true)
        ),
      options: {
        category: "Admin",
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
    const setting = interaction.options.getString("setting");
    const status = interaction.options.getBoolean("status");
    const setupData = await client.db.setupDatas.findOne({
      guildId: interaction.guild.id,
    });
    if (!setupData)
      return await interaction.reply({
        content:
          "> Counting channel not available in this server. Use `/setup create` to setup count game.",
        ephemeral: true,
      });
    let updateSetup;
    switch (setting) {
      case "math":
        updateSetup = await client.db.setupDatas.findOneAndUpdate(
          { guildId: interaction.guildId },
          { math: status },
          { upsert: true, new: true }
        );
        await client.redis.set(
          interaction.guildId + "setup",
          JSON.stringify(updateSetup),
          "EX",
          60
        );

        await interaction.reply({
          content: `> Math Calculate setting has successfully toggled to **${status}**.`,
          ephemeral: true,
        });
        break;
      case "numOnly":
        updateSetup = await client.db.setupDatas.findOneAndUpdate(
          { guildId: interaction.guildId },
          { numOnly: status },
          { upsert: true, new: true }
        );
        await client.redis.set(
          interaction.guildId + "setup",
          JSON.stringify(updateSetup),
          "EX",
          60
        );
        await interaction.reply({
          content: `> Number Only setting has successfully toggled to **${status}**.`,
          ephemeral: true,
        });
        break;
      default:
        break;
    }
  }
}

module.exports = Toggle;
