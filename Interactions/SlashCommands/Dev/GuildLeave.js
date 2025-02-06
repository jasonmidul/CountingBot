const Command = require("../../../Structures/Classes/BaseCommand");
const {
  SlashCommandBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
} = require("discord.js");

class GuildLeave extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("gleave")
        .setDescription("Leaves a server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription(
              "enter guild id to leave (type `list` for all guilds)."
            )
            .setRequired(true)
        ),
      options: {
        devOnly: true,
      },
    });
  }
  async execute(interaction, client) {
    try {
      const id = interaction.options.getString("id");

      if (id.toLowerCase() === "list") {
        client.guilds.cache.forEach((guild) => {
          console.log(`${guild.name} | ${guild.id}`);
        });
        const guild = client.guilds.cache.map(
          (guild) => ` ${guild.name} | ${guild.id}`
        );
        try {
          return interaction.reply({
            content: `Guilds:\n\`${guild}\``,
            ephemeral: true,
          });
        } catch {
          return interaction.reply({
            content: `check console for list of guilds`,
            ephemeral: true,
          });
        }
      }

      const guild = client.guilds.cache.get(id);

      if (!guild) {
        return interaction.reply({
          content: `\`${id}\` is not a valid guild id`,
          ephemeral: true,
        });
      }

      await guild
        .leave()
        .then((c) => console.log(`Left guild ${id}`))
        .catch((err) => {
          console.log(err);
        });
      return interaction.reply({
        content: `Left guild \`${id}\``,
        ephemeral: true,
      });
    } catch (error) {
      console.log(`there was an error trying to leave guild ${id}`, error);
    }
  }
}

module.exports = GuildLeave;
