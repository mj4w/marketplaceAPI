import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../helpers/jwt_helpers.js";
import { status, successMessage, errorMessage } from "../helpers/status.js";
import { loginSchema, registrationSchema } from "../helpers/validation.js";
import User from '../model/user.model.js';

export const register = async(req,res,next) => {
    try {
        console.log(req.body)
        const result = await registrationSchema.validateAsync(req.body);

        // does exist
        const emailExist = await User.findOne({ email: result.email });
        const usernameExist = await User.findOne({ username: result.username });

        if (emailExist) {
            return res.status(status.conflict).json({ msg: `${result.email} is already registered` });
        }
        
        if (usernameExist) {
            return res.status(status.conflict).json({ msg: `${result.username} is already registered` });
        }

        // create user
        const newUser = new User({ 
            ...result
        });
        const savedUser = await newUser.save();

        // Generate Tokens
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)

        // no password include
        const { password: _, ...info} = savedUser._doc;

        res.status(status.created).json({ 
            msg: "Registered successfully!", 
            response: info, 
            accessToken, 
            refreshToken 
        });
    } catch (error) {
        next(error)
    }
}

export const login = async(req,res) => {
    try {
        const result = await loginSchema.validateAsync(req.body)
        const user = await User.findOne({ email: result.email })
        if (!user) return res.status(status.notfound).json({ msg: "Email Not Registered "})

        const isMatch = await user.isValidPassword(result.password);
        if (!isMatch) return res.status(status.unauthorized).json({ msg: "Email or Password is Incorrect"})

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        // not include password in response 
        const { password: _, ...info} = user._doc;


        res
        .cookie("accessToken", accessToken, {
            httpOnly: true,
        })
        .status(status.success)
        .json({
            msg: "Login Successfully", 
            response: info, 
            accessToken, 
            refreshToken
        })

    } catch (error) {
        next(error)
    }
}

export const logout = async(req,res) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) return res.status(status.bad).json({ msg: "Refresh token is required"})
        // verify refresh token
        await verifyRefreshToken(refreshToken)
        res.status(status.success).json({ response: "Logout successfully"})
    } catch (error) {
        next(error)
    }
}