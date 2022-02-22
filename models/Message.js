const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Message = mongoose.model(
  "Message",
  new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    user: {type: String, required: true},
    userId: {type: String, required: true},
    time: {type: String}
  })
);

module.exports = Message;
