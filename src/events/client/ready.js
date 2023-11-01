const mongoose = require('mongoose');
const { ActivityType } = require('discord.js');
const client = require('../../index');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log('✅ Bot Is Ready!');
    
    if (!client.config.mongoUrl) return;
    await mongoose.connect(client.config.mongoUrl || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    
    if (mongoose.connect) {
      console.log("The database is running!")
    }
    
    setInterval(() => {
        const statuses = [
            { name: `Count Game`, type: ActivityType.Listening },
            { name: `/help`, type: ActivityType.Playing }
        ];
        const status2 = ['Online'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const status3 = status2[Math.floor(Math.random() * status2.length)];
        client.user.setActivity(status);
        client.user.setStatus(status3);
    }, 5000);
  },
};