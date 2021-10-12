const mongoose = require("mongoose");

const ConvoSchema = new mongoose.Schema({
  messageGroup: {
    type: String
  },
  receiverId: {
    type: String
  },
  receiverName: {
    type: String
  },
  senderId: {
    type: String
  },
  senderName: {
    type: String
  },
  message: {
    type: String
  },
  isRead: {
    type: Boolean
  }
})

const Convo = mongoose.model("Convo", ConvoSchema);

module.exports = Convo;