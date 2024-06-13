import Jwt from "jsonwebtoken";
import { status, successMessage, errorMessage } from "./status.js";
import environment from "../env.js";

export const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            // TODO
            // iss: "website.com"
        }
        const secret = environment.access_token
        const options = {
            expiresIn: "1d",
            // issuer: "website.com",
            audience: userId,
        }
        Jwt.sign(payload, secret, options, (error, token) => {
            if (error){
                console.log(error.message)
                reject(status.notfound)
            }
            resolve(token)
        })
    })
}

export const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            // TODO
        }
        const secret = environment.refresh_token
        const options = {
            expiresIn: "1y",
            issuer: "website.com",
            audience: userId,
        }
        Jwt.sign(payload,secret,options, (error, token ) => {
            if (error){
                console.log(error.message)
                reject(status.notfound)
            }
            resolve(token)
        })
    })
}

export const verifyAccessToken = (req,res,next) => {
    if (!req.headers['authorization']) return next(status.unauthorized)
    const authHeader = req.headers['authorization']
    const bearerTOken = authHeader.split(' ')
    const token = bearerTOken[1]
    Jwt.verify(token, environment.access_token, (error,payload) => {
        if (error){
            // const message = error.name === "JsonWebTokenError" ? "Unauthorizzed" : error.message
            return next(status.unauthorized)
        }
        req.payload = payload
        next()
    })

}
export const verifyRefreshToken = (refreshToken) => {
    return new Promise( (resolve, reject) => {
        const secret = environment.refresh_token
        Jwt.verify(refreshToken, secret, (error, payload) => {
            if (error) return reject(status.unauthorized)
            const userId = payload.aud
            resolve(userId)
        })
    })
}
