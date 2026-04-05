import joi from "joi";

export const registerValidation = joi.object({
    username: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});

export const loginValidation = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});