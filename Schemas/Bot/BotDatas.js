const { Schema, model } = require("mongoose");

const botSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  cmdUsed: {
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = model("BotDatas", botSchema);
