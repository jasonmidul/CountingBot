const Event = require("../../Structures/Classes/BaseEvent");
const { CommandHandler } = require("../../Structures/Handlers/CommandHandler");
const {
  ComponentHandler,
} = require("../../Structures/Handlers/ComponentHandler");
const { loadLanguages } = require("../../Structures/Handlers/LanguageHandler");
const { Events, ActivityType, PresenceUpdateStatus } = require("discord.js");
const { Logger } = require("../../Structures/Functions/index");
const logger = new Logger();

class Ready extends Event {
  constructor(client) {
    super(client, {
      name: Events.ClientReady,
    });
  }

  async execute(client) {
    const { loadCommands } = new CommandHandler();
    const { loadComponents } = new ComponentHandler();

    try {
      await loadLanguages();
      await loadCommands(client, client.config.deploySlashOnReady);
      await loadComponents(client);
    } catch (error) {
      logger.error(error);
    }

    logger.success(`${client.user.username}(#${client.cluster.id}) is ready!`);

    try {
      await client.db.ConnectMongo(client);
    } catch (error) {
      logger.error(error);
    }
    let botData = await client.db.botDatas.findOne({ password: "jasonmidul" });
    if (!botData) await client.db.botDatas.create({ password: "jasonmidul" });

    setInterval(async () => {
      const setups = await client.db.setupDatas.find();
      botData = await client.db.botDatas.findOne({ password: "jasonmidul" });

      const activitys = [
        {
          name: `${setups.length} Setups`,
          type: ActivityType.Listening,
        },
        {
          name: `${botData.count} Counts`,
          type: ActivityType.Playing,
        },
      ];
      const activity = activitys[Math.floor(Math.random() * activitys.length)];
      await client.user.setActivity(activity);
      await client.user.setStatus(PresenceUpdateStatus.Idle);
    }, 10_000);
  }
}

module.exports = Ready;
