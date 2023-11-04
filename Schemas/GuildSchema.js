const { Schema, model } = require('mongoose');

//required : id, channelId 

const guildSchema = new Schema({
  name: {
    type: String,
    default: `undefined`
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  channelId: {
    type: String
  },
  math: {
    type: Boolean,
    default: false
  },
  totalScore: {
    type: Number,
    default: 0
  },
  highScore: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  saves: {
    type: Number,
    default: 0
  },
  saveSlot: {
    type: Number,
    default: 2
  },
  count: {
    right: {
      type: Number,
      default: 0
    },
    rong: {
      type: Number,
      default: 0
    }
  },
  numOnly: {
    type: Boolean,
    default: false
  },
  countRole: {
    on: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: `None`
    }
  },
  reaction: {
    right: {
      type: String,
      default: `✅`
    },
    rong: {
      type: String,
      default: `❌`
    },
    warn: {
      type: String,
      default: `⚠️`
    },
    saves: {
      type: String,
      default: `⛑️`
    }
  },
  lastUser: {
    type: String,
    default: 'None'
  }
});

module.exports = model('guildData', guildSchema);