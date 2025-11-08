import Joi from "joi";

const registerValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
})

export {
    registerValidation
}