import Order from '../model/order.model.js'
import Gig from '../model/gig.model.js'
import { status } from '../helpers/status.js';


export const createOrder = async (req,res,next) => {
    try {
        const gig = await Gig.findById(req.params.id);
        const newOrder = new Order({
            gigId: gig._id,
            img: gig.cover,
            title: gig.title,
            buyerId: req.userId,
            sellerId: gig.userId,
            price: gig.price,
            payment_intent: "temporary"

        })

        await newOrder.save();
        res.status(status.success).json({ msg: 'Order created successfully'})
    } catch (error) {
        next(error)
    }
}

export const getOrders = async (req,res,next) => {
    try {
        const orders = await Order.find({
            ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
            isCompleted: true,
        })
        res.status(status.success).json(orders)
    } catch (error) {
        next(error)
    }
}
