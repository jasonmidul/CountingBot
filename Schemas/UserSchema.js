const { Schema, model } = require('mongoose');
// required : id
const userSchema = new Schema({
  name: {
    type: String,
    default: 'undefined'
  },
  id: {
    type: String,
    required: true
  },
  cmdUsed: {
    type: Number,
    default: 0
  },
  saves: {
    type: Number,
    default: 0
  },
  saveSlot: {
    type: Number,
    default: 4
  },
  vote: {
    count: {
      type: String,
      default: 0
    },
    time: {
      type: Date,
      default: new Date(0)
    }
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

module.exports = model('UserData', userSchema);