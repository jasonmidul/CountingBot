const { EmbedBuilder, Events } = require('discord.js');
const { CountingBot } = require("../../Structures/Classes/CountingBot");
const express = require('express');
const Topgg = require('@top-gg/sdk');
const userDatas = require('../../Schemas/UserSchema');
const { VoteLog } = require("../../Systems/VoteLogger");
const app = express();

const webhook = new Topgg.Webhook('vote');

module.exports = {
  name: Events.ClientReady,
  
  /**
    * @param {CountingBot} client
    */
  
  
  async execute(client) {

    app.post('/vote', webhook.listener(async (vote) => {

      const userData = await userDatas.findOne({ id: vote.user });
      
      let embed = new EmbedBuilder()

      if (userData) {
        if (userData.saveSlot > userData.saves) {
          userData.saves += 1;
          userData.vote.count += 1;
          userData.save();
          
          embed.setTitle("🎁 You just voted me!")
          embed.setDescription(`> You claimed \`1\` save as vote reward! \n> You can vote [here](https://top.gg/bot/${client.config.clientId}) in every \`12h\`. \n> Now you have **${userData.saves}/${userData.saveSlot}** saves.\n> Use \`/user\` for more information.`)
          embed.setColor(client.color)
          embed.setFooter({ text: `Thanks for voting me! ❤️` })
            .setTimestamp()
        } else {
          userData.vote.count += 1;
          userData.vote.time = new Date();
          userData.save();
          
          embed.setTitle("🎁 You just voted me!")
          embed.setDescription(`**You vote slot is full. You need to upgrade your profile for increase your saves slote. \n\n**> You claimed noting as vote reward! \n> You can vote [here](https://top.gg/bot/${client.config.clientId}) in every \`12h\`. \n> Now you have **${userData.saves}/${userData.saveSlot}** saves.\n> Use \`/profile\` for more information.`)
            .setColor(client.color)
            .setFooter({ text: `Thanks for voting me! ❤️` })
            .setTimestamp()
        }
        
      } else {
        userDatas.create({
          id: vote.user,
          saves: 1,
          vote: {
            count: 1,
            time: new Date()
          }
        })
        
        embed.setTitle("🎁 You just voted me!")
        embed.setDescription(`> You claimed \`1\` save as vote reward! \n> You can vote [here](https://top.gg/bot/${client.config.clientId}) in every \`12h\`. \n> Now you have **${userData.saves}/${userData.saveSlot}** saves.\n> Use \`/profile\` for more information.`)
        embed.setColor(client.color)
        embed.setFooter({ text: `Thanks for voting me! ❤️` })
        embed.setTimestamp()
      }
      
      const voteUser = await client.users.fetch(vote.user);
      
      if (voteUser) {
        
        VoteLog(client, `${vote.user}`, `${voteUser.username}`);
        
        try {
          
          await voteUser.send({ embeds: [embed] });
        
          console.log(`[vote] Dm sent to -` + vote.user)
        
        } catch (err) {
        
          console.log(`[vote] Cant dm - ` + vote.user + err);
        }
        
      } else {
        
        VoteLog(client, `${vote.user}`, `${voteUser.username}`);
        
      }
      
      
    }));

    app.listen(5012); // Port

  }
}