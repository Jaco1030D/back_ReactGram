const {validationResult} = require('express-validator');

const validate = (req, res, next) =>{
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next()
    }

    const ExtractedErrors = []

    errors.array().map(err =>ExtractedErrors.push(err.msg))

    return res.status(422).json({
        errors: ExtractedErrors
    })

}

module.exports = validate