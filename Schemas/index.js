const mongoose = require("mongoose");
const botDatas = require("./Bot/BotDatas");
const setupDatas = require("./Counting/SetupData");
const gameDatas = require("./Counting/GameData");
const languageDatas = require("./Server/LanguageData");
const userDatas = require("./User/UserData");
const { Logger } = require("../Structures/Functions/index");
const logger = new Logger();

function ConnectMongo(client) {
  if (client.config.mongoUrl) {
    logger.info("Trying to connect with database...");
    mongoose.set("strictQuery", false);
    mongoose
      .connect(client.config.mongoUrl)
      .then((data) => {
        logger.success(
          `Database has been connected to: "${data.connection.name}"`
        );
      })
      .catch((err) => logger.error(err));
  } else logger.warn(`You forget to add mongoUrl in config.js`);
}

module.exports = {
  ConnectMongo,
  botDatas,
  setupDatas,
  gameDatas,
  userDatas,
  languageDatas,
};
