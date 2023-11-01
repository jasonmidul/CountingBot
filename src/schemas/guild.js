const { model, Schema } = require('mongoose');

let counter = new Schema ({
    guildId: String,
    guildName: String,
    countChannel: String,
    lastScore: Number,
    lastUser: String,
    counterRole: String,
    highScore: Number,
    countOnly: String,
})

module.exports = model('counter', counter);