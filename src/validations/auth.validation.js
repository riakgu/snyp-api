import Joi from "joi";

const registerValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
})

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const refreshValidation = Joi.object({
    refreshToken: Joi.string().required(),
})

const logoutValidation = Joi.object({
    userId: Joi.string().required(),
    token: Joi.string().required(),
})

const getValidation = Joi.object({
    userId: Joi.string().required(),
    token: Joi.string().required(),
})

export {
    registerValidation,
    loginValidation,
    refreshValidation,
    logoutValidation,
    getValidation,
}