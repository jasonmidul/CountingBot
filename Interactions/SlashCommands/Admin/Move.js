const Command = require("../../../Structures/Classes/BaseCommand");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const { t } = require("i18next");

class Toggle extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("To move the counting game in another channel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Which channel you want to setup counting game.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
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
    const channel = interaction.options.getChannel("channel");
    let setupData = await client.db.setupDatas.findOne({
      guildId: interaction.guild.id,
    });
    if (!setupData)
      return await interaction.reply({
        content:
          "> Counting channel not available in this server. Use `/setup create` to setup count game.",
        ephemeral: true,
      });
    setupData = await client.db.setupDatas.findOneAndUpdate(
      { guildId: interaction.guildId },
      { setupChannel: channel.id },
      { upsert: true, new: true }
    );
    await client.redis.set(
      interaction.guildId + "setup",
      JSON.stringify(setupData),
      "EX",
      60
    );

    await interaction.reply({
      content: `> Counting channel has successfully moved to <#${channel.id}>.`,
      ephemeral: true,
    });
    await channel.send(
      `✨ **This channel has been updated as a counting channel!**`
    );
    channel.setTopic(client.config.cTopic);
  }
}

module.exports = Toggle;
