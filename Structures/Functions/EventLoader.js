const { CountingBot } = require("../Classes/CountingBot");
const fs = require('fs');

/**
 * @param {CountingBot} client
 */
async function loadEvents(client) {

  await client.events.clear()

  let Loaded = 0;
  let Failed = 0;

  const folders = fs.readdirSync(`./Events`);

  for (const folder of folders) {
    await Promise.all(fs.readdirSync(`./Events/${folder}`).filter((file) => file.endsWith(".js")).map(async (file) => {
      const event = require(`../../Events/${folder}/${file}`);
      
      if (!event.name) {
        Failed++;
      } else {
        const execute = (...args) => event.execute(...args, client);
        client.events.set(event.name, execute);

        if (event.rest) {
          if (event.once) {
            client.rest.once(event.name, execute);
          } else {
            client.rest.on(event.name, execute);
          }
        } else {
          if (event.once) {
            client.once(event.name, execute);
          } else {
            client.on(event.name, execute);
          }
        }

        Loaded++;
      }
    }));
  }

  if (Loaded !== 0) console.log(`Loaded ${Loaded} events`);
  if (Failed !== 0) console.log(`Failed to load ${Failed} events`);

}

module.exports = { loadEvents };