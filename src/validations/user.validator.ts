import joi from '@hapi/joi';


const validateUserSaveSchema = joi.object({
    user_name: joi.string().trim().required(),
    email: joi.string().trim().email().min(4).max(50).required(),
    password: joi.string().min(4).max(20).required(),
})
const validateUserLoginSchema = joi.object({
    user_name: joi.string().trim().required(),
    email: joi.string().trim().email().min(4).max(50).required(),
    password: joi.string().min(4).max(20).required(),
    first_name: joi.string().trim().required(),
    last_name: joi.string().trim().required(),
})

export const validateUserSave = (user: any) => {
    return validateUserSaveSchema.validate(user)
}
export const validateUserLogin = (user: any) => {
    return validateUserLoginSchema.validate(user)
}