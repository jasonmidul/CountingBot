const { Schema, model } = require("mongoose");

const gameData = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "undefined"
  },
  lastCounter: {
    type: String,
    required: false,
    default: "none",
  },
  count: {
    type: Number,
    default: 0,
  },
  totalCount: {
    right: {
      type: Number,
      default: 0,
    },
    rong: {
      type: Number,
      default: 0,
    },
  },
  highestCount: {
    type: Number,
    default: 0,
  },
  saves: {
    type: Number,
    default: 2,
  },
  saveSlot: {
    type: Number,
    default: 2,
  },
  reaction: {
    success: {
      type: String,
      default: "✅",
    },
    fail: {
      type: String,
      default: "❌",
    },
    save: {
      type: String,
      default: "⛑️",
    },
    warn: {
      type: String,
      default: "⚠️",
    },
  },
});

module.exports = model("GameData", gameData);
