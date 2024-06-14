import { status, errorMessage, successMessage } from "../helpers/status.js";

export const homeGig = async (req,res,next) => {
    try {
        res.send("Hello World!");
    } catch (error) {
        res.status(status.error).json(error.message)
    }
}