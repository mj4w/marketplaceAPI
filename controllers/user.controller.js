import { status } from '../helpers/status.js';
import User from '../model/user.model.js'
import { createError } from '../utils/createError.js';


export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(status.unauthorized).json({ msg: 'User not found'})

        await User.findByIdAndDelete(req.params.id)

        res.json({ msg: "User deleted successfully! "})
        
    } catch (error) {
        next(createError(status.error, error))
    }
};