const winston = require("winston")

dateFormat = () => {  return new Date(Date.now()).toUTCString()};

const logger = winston.createLogger({    
  //Transports: thiết lập cách thức log của logger  
  transports: [    
    // hiển thị log thông qua console    
    new winston.transports.Console(),  
    // Thiết lập ghi các errors vào file       
    new winston.transports.File({          
      filename: `./logs/logger.log`        
    })      
  ],
  // thiết lập định dạng của log với hàm toUpperCase trả về level dạng in hoa
  format: winston.format.printf((info) => {        
    let message = `${dateFormat()} | ${info.level.toUpperCase()} | loggers.log | ${info.message} | `                     
    return message      
  })   

});

//hàm log ra level(error, info,..) và message của level
const loggerFunction = (level, message) => {
    logger.log({
      level,
      message
  })
}

  module.exports = loggerFunction;