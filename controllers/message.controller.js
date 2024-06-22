import { status } from '../helpers/status.js';
import Message from '../model/message.model.js'
import Conversation from '../model/conversation.model.js'

export const createMessage = async(req,res,next) => {
    const newMessage = new Message({
        conversationId: req.body.conversationId,
        userId: req.userId,
        desc: req.body.desc,
    })
    try {
      const savedMessage = await newMessage.save()
      await Conversation.findOneAndUpdate({ id: req.body.conversationId}, {
        $set: {
            readBySeller: req.isSeller,
            readByBuyer: !req.isSeller,
            lastMessage: req.body.desc,
        }
      }, { new: true})
      res.status(status.created).json(savedMessage)
    } catch (error) {
        next(error);
    }
}

export const getMessages = async(req,res,next) => {
    try {
        const messages = await Message.find({ conversationId: req.params.id})
        res.status(status.success).json(messages) 
    } catch (error) {
        next(error);
    }
}