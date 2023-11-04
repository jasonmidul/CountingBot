const { Schema, model } = require('mongoose');

const botSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  cmdUsed: {
    type: Number,
    default: 1
  },
  count: {
    right: {
      type: String,
      default: 0
    },
    rong:{
      type: String,
      default: 0
    }
  }
});

module.exports = model('BotData', botSchema);
