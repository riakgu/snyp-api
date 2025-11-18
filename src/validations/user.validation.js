import Joi from "joi";

const updateUserValidation = Joi.object({
    name: Joi.string().required(),
})

export  {
    updateUserValidation,
}