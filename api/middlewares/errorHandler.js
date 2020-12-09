const loggerFunction = require('../../loaders/logger');



function errorHandler (error, req, res, next){
    loggerFunction('error', error.message);
    return res.status(error.status||505).json({
        message: error.message || 'Lỗi rồiiiii'
    })
}

module.exports = errorHandler;
