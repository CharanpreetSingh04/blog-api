const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Comment = mongoose.model(
  "Comment",
  new Schema({
    comment: { type: String, required: true },
    user: {type: String, required: true},
    time: {type: String},
    message: {type: String, required: true}
  })
);

module.exports = Comment;
