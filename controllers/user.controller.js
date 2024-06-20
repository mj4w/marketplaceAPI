import { status } from '../helpers/status.js';
import User from '../model/user.model.js'
import { createError } from '../utils/createError.js';


export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(status.unauthorized).json({ msg: 'User not found'})

        if (req.userId !== user._id.toString()) return res.status(status.unauthorized).json({ msg: "You can delete only your account" })

        await User.findByIdAndDelete(req.params.id)

        res.json({ msg: "User deleted successfully! "})
        
    } catch (error) {
        next(createError(status.error, error))
    }
};

export const getUser = async (req, res,next) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) return res.status(status.unauthorized).json({ msg: 'User not found'})
        const { username, img, country } = user._doc;

        res.status(status.success).json({username, img, country})
    } catch (error) {
        next(createError(status.error, error))
    }
};