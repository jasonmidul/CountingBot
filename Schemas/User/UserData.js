const { Schema, model } = require("mongoose");

const userData = new Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "undefined"
  },
  score: {
    type: Number,
    default: 0,
  },
  count: {
    right: {
      type: Number,
      default: 0,
    },
    rong: {
      type: Number,
      default: 0,
    },
  },
  saves: {
    type: Number,
    default: 2,
  },
  saveSlot: {
    type: Number,
    default: 4,
  },
  vote: {
    count: {
      type: Number,
      default: 0,
    },
    time: {
      type: Date,
      default: new Date(0),
    },
  },
});

module.exports = model("UserData", userData);
