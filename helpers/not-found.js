import { status, successMessage, errorMessage } from "./status.js"

const notFound = async (req,res) => {
    res.status(status.error).json({ error: "Route not found"})
}

export default notFound