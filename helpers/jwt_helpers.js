import Jwt from "jsonwebtoken";
import { status, successMessage, errorMessage } from "./status.js";
import environment from "../env.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/createError.js";
import User from '../model/user.model.js'

export const signAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            // isSeller: user.isSeller,
            id: user.id,
            isSeller: user.isSeller,
            username: user.username,
            email: user.email

        }
        const secret = environment.access_token
        const options = {
            expiresIn: "1d",
            audience: user.id,
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

export const verifyAccessToken = async (req, res, next) => {
    try {
      // Check if Authorization header exists
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(status.unauthorized).json({ msg: "No Authorization header" });
      }
  
      const bearerToken = authHeader.split(' ')[1];
      if (!bearerToken) {
        return res.status(status.unauthorized).json({ msg: "Invalid Authorization header format" });
      }
  
      // Verify the token
      Jwt.verify(bearerToken, environment.access_token, async (error, payload) => {
        if (error) {
          return res.status(status.unauthorized).json({ msg: "Token verification failed" });
        }
  
        const tokenFromCookie = req.cookies.accessToken; 
        if (bearerToken !== tokenFromCookie) {
          return res.status(status.unauthorized).json({ msg: "Token mismatch" });
        }

        // Add user information to request
        req.userId = payload.id
        req.isSeller = payload.isSeller
        req.username = payload.username,
        req.email = payload.email
        console.log(payload)
        next();
      });
    } catch (error) {
      next(createError(status.INTERNAL_SERVER_ERROR, error.message));
    }
  };

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


export const generateResetToken = (email) => {
    return new Promise((resolve, reject) => {
        Jwt.sign(
            { email },
            environment.reset_token,
            { expiresIn: '1h' },
            (error, token) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(token);
                }
            }
        );
    });
};

export const decodedToken = (token) => {
    return new Promise((resolve, reject) => {
        Jwt.verify(token, environment.reset_token, (error, decoded) => {
            if (error) {
                reject(error);
            } else {
                resolve(decoded);
            }
        });
    });
};

export const hashedPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        return hashed;
    } catch (error) {
        throw error;
    }
};