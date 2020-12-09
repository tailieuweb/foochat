const logger = require('../loaders/logger');
const Models = require('../models');
const mongoose = require('mongoose');

class MessageService {

    constructor(userId, recipientId, message=null, location=null) {
        this.senderId = mongoose.Types.ObjectId(userId)
        this.recipientId = mongoose.Types.ObjectId(recipientId)
        this.message = message;
        this.location = location;
    }
    
    async createMessage(){
        let currentUser = await Models.User.findById(this.senderId)
        const receiver = await Models.User.findById(this.recipientId)
        const message = await  Models.Message.create({
            text: this.message ,
            createdBy: currentUser.username,
            location: this.location
         })
        const userRecord = await currentUser.saveMessage(receiver, message, 'send');
        await receiver.saveMessage(currentUser, message, 'receive');
        currentUser = await userRecord.filterUserData()
        const messages = await userRecord.getMessages(receiver);    
        logger('info', `${currentUser.username} đã gửi tin nhắn đến ${receiver.username}`)  
        return {messages, currentUser}
    }

    async getMessagesBetweenUsers(){
        const recipient = await Models.User.findById(this.recipientId);
        const user = await Models.User.findById(this.senderId);
        const messages = await user.getMessages(recipient);    
        return messages;   
    }   
}

module.exports = MessageService;