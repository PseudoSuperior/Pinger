const mongoose = require("mongoose");
const whateverSchema = new mongoose.Schema({
    guildId: {
      type: String,
      unique: true
    },
    text: String,
    members: [{
      id: String,
      done: Boolean
    }]
  });
const PingerModel = mongoose.model("Pinger", whateverSchema, "Pinger");

module.exports = PingerModel;