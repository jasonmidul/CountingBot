const { model, Schema } = require('mongoose');

let bans = new Schema({
    guildId: String,
    userId: String,
    reason: String
});

module.exports = model('bans', bans);
