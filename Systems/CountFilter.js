const math = require('mathjs');
const guildDatas = require('../Schemas/GuildSchema');
const userDatas = require('../Schemas/UserSchema');



/**
 *@param {guildDatas} guildData
 *@param {userDatas} userData
 */
function filterContent(message, guildData, userData) {

  const messageContent = message.content.toLowerCase();
  let output = 'seven';
  let number;
  
  if (!isNaN(messageContent)) {
    number = parseInt(messageContent);
  }

  if (guildData.math == false && !isNaN(number)) {
    const mathCal = math.evaluate(`${messageContent}`);
    number = parseInt(mathCal);
  }
  
  if (message.author.id == guildData.lastUser) {
    if (userData.saves !== 0) {
      output = 'two';
    } else if (guildData.saves !== 0) {
      output = 'three';
    } else {
      output = 'four';
    }
  } else if (guildData.score == 0 && number !== guildData.score + 1) {
    output = 'five';
  } else if (number !== guildData.score + 1 && userData.saves !== 0) {
    output = 'two';
  } else if (number !== guildData.score + 1 && guildData.saves !== 0) {
    output = 'three';
  } else if (number !== guildData.score + 1) {
    output = 'six';
  } else {
    output = 'one';
  }
  
  return output;
}

module.exports = { filterContent };