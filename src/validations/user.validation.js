import Joi from "joi";

const updateUserValidation = Joi.object({
    name: Joi.string().required(),
})

const updatePasswordValidation = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
})

export  {
    updateUserValidation,
    updatePasswordValidation,
}