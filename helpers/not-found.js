import { createError } from "../utils/createError.js";
import { status, successMessage, errorMessage } from "./status.js"

const notFound = async (req,res) => {
    return createError(status.error, "Route Not Found");
}

export default notFound