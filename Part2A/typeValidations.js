const Joi = require('joi');

function typeValidation(inputObj) {
    const STOCK_SYMBOLS = ['AAPL', 'HP', 'IBM', 'AMZN', 'MSFT', 'GOOGL', 'INTC', 'CSCO', 'ORCL', 'QCOM'];
    const schema = Joi.object({
        "user id": Joi.string().required().pattern(new RegExp('^[a-zA-Z$][a-zA-Z_$0-9]*$')),
        buy: Joi.array().items(Joi.object({
            "stock symbol": Joi.string().valid(...STOCK_SYMBOLS).required(),
            "shares": Joi.number().integer().min(1).required(),
            "at max": Joi.number().min(0).required(),
        })).optional(),
        sell: Joi.array().items(Joi.object({
            "stock symbol":  Joi.string().valid(...STOCK_SYMBOLS).required(),
            "shares": Joi.number().integer().min(1).required(),
            "at min": Joi.number().min(0).required(),
        })).optional()
    });
    const isValid = schema.validate(inputObj);
    if (isValid.error) {
        throw new Error(isValid.error);
    }
    const {buy = [], sell = []} = inputObj;
    if (!buy.length && !sell.length) {
        throw new Error('ValidationError: "sell" or "buy" must be present.')
    }
}

module.exports = typeValidation;
