const { Events, ActivityType } = require("discord.js");
const { CountingBot } = require("../../Structures/Classes/CountingBot");
const { loadCommands } = require("../../Structures/Functions/CommandLoader")

module.exports = {
  name: Events.ClientReady,
  once: true,
  
  /**
   * @param {CountingBot} client
   */
  
  async execute(client) {
    
    const { user } = client;
    console.log(`${user.tag} is online!`)
    
    loadCommands(client);
    
    setInterval(() => {
      const activitys = [
        {
          name: `@jasonmidul`,
          type: ActivityType.Listening
        },
        {
          name: `/help`,
          type: ActivityType.Playing
        }
      ];
      const status = ['Online', 'Idle'];
      const activity = activitys[Math.floor(Math.random() * activitys.length)];
      const stats = status[Math.floor(Math.random() * status.length)];
      user.setActivity(activity);
      user.setStatus(stats);
    },5000);
    
  }
}