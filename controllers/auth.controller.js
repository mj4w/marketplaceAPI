import { 
    decodedToken,
    generateResetToken, 
    hashedPassword, 
    signAccessToken, 
    signRefreshToken, 
    verifyRefreshToken 
} from "../helpers/jwt_helpers.js";
import { sendResetEmail } from "../helpers/sendResetEmail.js";
import { 
    status, 
    successMessage, 
    errorMessage 
} from "../helpers/status.js";
import { 
    loginSchema, 
    registrationSchema 
} from "../helpers/validation.js";
import User from '../model/user.model.js';
import { createError } from '../utils/createError.js';

export const register = async(req,res,next) => {
    try {
        // console.log(req.body)
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
        const accessToken = await signAccessToken(savedUser)
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
        next(createError(status.error, error))

    }
}

export const login = async(req,res,next) => {
    try {
        const result = await loginSchema.validateAsync(req.body)
    
        const user = await User.findOne({ email: result.email })
        if (!user) return res.status(status.notfound).json({ msg: "Email Not Registered "})

        const isMatch = await user.isValidPassword(result.password);
        if (!isMatch) return res.status(status.unauthorized).json({ msg: "Email or Password is Incorrect"})

        const accessToken = await signAccessToken(user)
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
            response: {
                ...info, 
                accessToken, 
                refreshToken
            }
        })

    } catch (error) {
        next(createError(status.error, error))
    }
}

export const logout = async(req,res) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) return res.status(status.bad).json({ msg: "Refresh token is required"})
        // verify refresh token
        await verifyRefreshToken(refreshToken)
        res.clearCookie("accessToken", {
            secure: true,
            sameSite: "none",
        }).status(status.success).json({ response: "User has been logged out"})
    } catch (error) {
        next(createError(status.error, error))
    }
}

export const logoutv2 = async(req,res) => {
    res
    .clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
    })
    .status(status.success)
    .json({ response: "User has been logged out" })
}


export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Generate reset token
        const resetToken = await generateResetToken(user.email);
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000 // 1hour
        await user.save();

        // send email with reset token
        sendResetEmail(user.email, resetToken);

        console.log("Reset Token:", resetToken);

        res.json({ msg: "Reset token sent to your email" });
    } catch (error) {
        console.error(error.message);
        next(createError(status.error, error))
    }
};

export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Verify and decode the token
        const decoded = await decodedToken(token);

        // Find user by email from decoded token
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if token has expired
        if (Date.now() > user.resetTokenExpiration) {
            return res.status(403).json({ msg: "Token Expired. Please request a new password reset." });
        }
        // saving fields
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        console.log(user.password)
        // Save the updated user
        await user.save();
        console.log(user);
        // Respond with success message
        res.status(200).json({ msg: "Password Reset Successful" });

    } catch (error) {
        console.error(error.message);
        next(createError(500, error));
    }
};