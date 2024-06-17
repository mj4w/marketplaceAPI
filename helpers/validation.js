import Joi from '@hapi/joi';

export const registrationSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    // password2: Joi.string().valid(Joi.ref('password')).required().messages({
    //     'any.only': 'Passwords do not match'
    // }),
    img: Joi.string().optional(),
    country: Joi.string().required(),
    phone: Joi.number().required(),
    desc: Joi.string().allow('').optional(),
    isSeller: Joi.boolean().optional()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});
