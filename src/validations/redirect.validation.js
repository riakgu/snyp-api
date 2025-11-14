import Joi from "joi";

const verifyPasswordLinkValidation = Joi.object({
    password: Joi.string().required(),
});

export {
    verifyPasswordLinkValidation,
}