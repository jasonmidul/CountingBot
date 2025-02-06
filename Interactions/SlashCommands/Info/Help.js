const Command = require("../../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const { PaginationEmbed } = require("../../../Structures/Functions/index");

class Help extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("help command"),
      options: {
        category: "Info",
      },
    });
  }

  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client
   */
  async execute(interaction, client) {
    let userCmd = [];
    let adminCmd = [];
    let infoCmd = [];
    let othersCmd = [];

    const cmdPush = (category, subCmd, command) => {
      try {
        switch (category.category) {
          case "User":
            if (subCmd.length !== 0) userCmd.push(...subCmd);
            else
              userCmd.push({
                name: `</${command.name}:${command.id}>`,
                value: command.description,
                inline: true,
              });
            break;
          case "Info":
            if (subCmd.length !== 0) infoCmd.push(...subCmd);
            else
              infoCmd.push({
                name: `</${command.name}:${command.id}>`,
                value: command.description,
                inline: true,
              });
            break;
          case "Admin":
            if (subCmd.length !== 0) adminCmd.push(...subCmd);
            else
              adminCmd.push({
                name: `</${command.name}:${command.id}>`,
                value: command.description,
                inline: true,
              });
            break;
          default:
            if (subCmd.length !== 0) othersCmd.push(...subCmd);
            else
              othersCmd.push({
                name: `</${command.name}:${command.id}>`,
                value: command.description,
                inline: true,
              });
            break;
        }
      } catch (error) {
        console.log(error);
      }
    };

    await client.application.commands
      .fetch()
      .then((commands) => {
        commands.forEach((command) => {
          let subCmd = [];
          command.options.forEach((option) => {
            if (option.type == 1) {
              subCmd.push({
                name: `</${command.name + " " + option.name}:${command.id}>`,
                value: option.description,
                inline: true,
              });
            }
          });
          const ctg = client.slashCommands.get(command.name);
          cmdPush(ctg, subCmd, command);
        });
      })
      .catch((err) => {
        console.error("Error fetching commands:", err);
      });
    const embeds = [
      new EmbedBuilder()
        .setTitle("User Commands")
        .addFields(userCmd)
        .setColor(Colors.DarkGreen),

      new EmbedBuilder()
        .setTitle("Info Commands")
        .addFields(infoCmd)
        .setColor(Colors.DarkGreen),

      new EmbedBuilder()
        .setTitle("Admin Commands")
        .addFields(adminCmd)
        .setColor(Colors.DarkGreen),

      new EmbedBuilder()
        .setTitle("Other Commands")
        .addFields(
          othersCmd.length !== 0
            ? othersCmd
            : {
                name: "⠀",
                value: "No command available in this category.",
              }
        )
        .setColor(Colors.DarkGreen),
    ];

    await PaginationEmbed(interaction, embeds);
  }
}

module.exports = Help;
