const { Schema, model } = require("mongoose");

const setupData = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  setupChannel: {
    type: String,
    required: true,
  },
  math: {
    type: Boolean,
    required: false,
    default: true,
  },
  numOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = model("SetupData", setupData);
