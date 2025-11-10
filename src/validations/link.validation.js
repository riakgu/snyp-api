import Joi from "joi";

const createLinkValidation = Joi.object({
    long_url: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
});

const createLinkAuthValidation = Joi.object({
    title: Joi.string().max(100),
    long_url: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
    short_code: Joi.string().min(3).max(20),
    password: Joi.string().max(100),
    expired_at: Joi.date().greater('now'),
});

export {
    createLinkValidation,
    createLinkAuthValidation
}