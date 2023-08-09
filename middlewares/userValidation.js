const {body} = require("express-validator")

const userCreateValidation = () =>{
    return [
        body("name")
            .isString()
            .withMessage("O nome é obrigatorio")
            .isLength({min: 3})
            .withMessage("O nome tem que ter mais de 3 caracteres"),
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatorio")
            .isEmail()
            .withMessage("Precisa ser um e-mail valido"),
        body("password")
            .isString()
            .withMessage("A senha é obrigatoria")
            .isLength({min: 5})
            .withMessage("A senha tem que ter mais de 5 caracteres"),
        body("confirmPassWord")
            .isString()
            .withMessage("A confirmação de senha é obrigatoria")
            .custom((value, {req}) =>{
                if (value != req.body.password) {
                    throw new Error("As senhas são diferentes")
                }
                return true
            })
            
    ]
}
const loginValidation = () =>{
    return [
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatorio")
            .isEmail()
            .withMessage("Precisa ser um e-mail valido"),
        body("password")
            .isString()
            .withMessage("A senha é obrigatoria")
    ]
}
const userUpdateValidation = () =>{
    return [
        body("name")
            .optional()
            .isLength({min: 3})
            .withMessage("O nome tem que ter mais de 3 caracteres"),
        body("password")
            .optional()
            .isLength({min: 5})
            .withMessage("A senha tem que ter mais de 5 caracteres")
    ]
}

module.exports = {userCreateValidation, loginValidation, userUpdateValidation}