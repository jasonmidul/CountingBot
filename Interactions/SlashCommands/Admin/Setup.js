const Command = require("../../../Structures/Classes/BaseCommand");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  ChannelType,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require("discord.js");

class Setup extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("setup")
        .setDMPermission(false)
        .setDescription("Setup create, delete or update.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subCommand) =>
          subCommand
            .setName("create")
            .setDescription("To setup a counting setup.")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription(
                  "Which channel you want to setup counting game."
                )
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("delete")
            .setDescription("To delete a counting setup.")
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
    const subCmd = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel("channel");
    const setupData = await client.db.setupDatas.findOne({
      guildId: interaction.guild.id,
    });
    const gameData = await client.db.gameDatas.findOne({
      guildId: interaction.guild.id,
    });
    const embed = new EmbedBuilder().setColor(Colors.DarkGreen);

    switch (subCmd) {
      case "create":
        if (setupData) {
          embed.setDescription(
            `\`❌\` The counting channel has already setuped in <#${setupData.setupChannel}>. Use \`/setup update\` for move or update setup settings.`
          );
          return interaction.reply({ embeds: [embed] });
        } else {
          client.db.setupDatas.create({
            guildId: interaction.guild.id,
            setupChannel: channel.id,
          });
          if (!gameData) {
            client.db.gameDatas.create({
              guildId: interaction.guild.id,
              name: interaction.guild.name,
            });
          }
          embed.setDescription(
            `\`✅\` **The counting channel has been setuped in <#${channel.id}>.**`
          );
        }
        await interaction.reply({ embeds: [embed] });
        await channel.send(
          `✨ **This channel has been setuped as a counting channel!**`
        );
        channel.setTopic(client.config.cTopic);
        break;
      case "delete":
        if (!setupData) {
          embed.setDescription(
            `\`❌\` Counting channel is not setuped in this server.`
          );
          return interaction.reply({ embeds: [embed] });
        } else {
          const modal = new ModalBuilder()
            .setCustomId("setup-delete")
            .setTitle("confirm?");

          const codeResiver = new TextInputBuilder()
            .setCustomId("confirm")
            .setLabel("Delete counting setup? Use /move instead.")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("type 'confirm' to delete")
            .setRequired(true);
          const actionRow = new ActionRowBuilder().addComponents(codeResiver);
          modal.addComponents(actionRow);
          await interaction.showModal(modal);
        }
        break;
      default:
        break;
    }
  }
}

module.exports = Setup;
