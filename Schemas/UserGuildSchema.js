const { Schema, model } = require('mongoose');
// required : id
const userGuildSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'undefined'
  },
  server: {
    type: String,
    required: true
  },
  saveUsed: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  count: {
    right: {
      type: String,
      default: 0
    },
    rong: {
      type: String,
      default: 0
    }
  }
});

module.exports = model('UserGuildData', userGuildSchema);