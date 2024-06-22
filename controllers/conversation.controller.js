import { status } from '../helpers/status.js';
import Conversation from '../model/conversation.model.js'

export const getConversation = async(req,res,next) => {
    try {
        const conversation = await Conversation.find(
            req.isSeller ? { sellerId: req.userId} : { buyerId: req.userId }
        )
        res.status(status.success).json(conversation)
    } catch (error) {
        next(error)
    }
}

export const createConversation = async(req,res,next) => {
    const newConversation = new Conversation({
        id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
        sellerId: req.isSeller ? req.userId : req.body.to,
        buyerId: req.isSeller ? req.body.to : req.userId,
        readBySeller: req.isSeller,
        readByBuyer: !req.isSeller,
    });
    try {
        const savedConversation = await newConversation.save()
        res.status(status.success).json(savedConversation);
    } catch (error) {
        next(error)
    }
}


export const getSingleConversation = async(req,res,next) => {
    try {
        const conversation = await Conversation.findOne({ id: req.params.id})
        if (!conversation) return res.status(status.unauthorized).json("Conversation not found")
        res.status(status.success).json(conversation)
    } catch (error) {
        next(error)
    }
}

export const updateConversation = async(req,res,next) => {
    try {
        const updatedConversation = await Conversation.findOneAndUpdate({id: req.params.id}, {
            $set: {
                // readBySeller: true,
                // readByBuyer: true
                ...(req.isSeller ? { readBySeller: true} : { readByBuyer: true }), 
            }
        }, {new:true})
        res.status(status.success).json(updatedConversation)
    } catch (error) {
        next(error)
    }
}