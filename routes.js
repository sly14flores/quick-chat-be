const express = require("express");
const userModel = require("./models/user");
const convoModel = require("./models/convo");
const app = express();

app.get("/test", async(request, response) => {

  try {
    response.send({status: "Ok"});
  } catch (error) {
    response.status(500).send(error);
  }

});

app.post("/user", async (request, response) => {

  const checkUser = await userModel.findOneAndUpdate({name: request.body.name.trim()}, {online: true});

  let user = null
  if (checkUser) {
    user = checkUser
  } else {
    user = new userModel(request.body);
    await user.save();
  }

  try {
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/logout/:id", async (request, response) => {

  const user = await userModel.findOneAndUpdate({_id: request.params.id}, {online: false});

  try {
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }  

})

app.get("/user/:id", async (request, response) => {
  const user = await userModel.findOne({_id: request.params.id});

  try {
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/users/:id", async (request, response) => {
  const users = await userModel.find({_id: {$ne: request.params.id}}).lean().exec()

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/users/unread/:receiverId/:senderId", async (request, response) => {

  const convo = await convoModel.find({
    receiverId: request.params.receiverId,
    senderId: request.params.senderId
  }).lean().exec()

  try {
    response.send(convo);
  } catch (error) {
    response.status(500).send(error);
  }

});

app.post("/convo", async(request, response) => {

  const conversation = new convoModel(request.body);
  if (request.body.messageGroup===null) {
    conversation.messageGroup = `${request.body.senderId}${request.body.receiverId}`
  }
  await conversation.save();

  let convo = await convoModel.find({messageGroup: conversation.messageGroup});

  try {
    response.send(convo);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/convo/:senderId/:receiverId", async(request, response) => {

  const { senderId, receiverId } = request.params;
  let messageGroup = `${senderId}${receiverId}`

  let convo = await convoModel.find({messageGroup});

  if (convo.length===0) {
    messageGroup = `${receiverId}${senderId}`
    convo = await convoModel.find({messageGroup});
  }

  try {
    response.send(convo);
  } catch (error) {
    response.status(500).send(error);
  }

});

app.put("/read", async(request, response) => {

  const id = request.body.id

  const message = await convoModel.findOneAndUpdate({_id: id}, {isRead: true});

  try {
    response.send(message);
  } catch (error) {
    response.status(500).send(error);
  }

})

module.exports = app;