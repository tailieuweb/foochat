const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const logger = require('../../loaders/logger');

const confirmAuthentication = async (req, res, next) =>{
    try {
        let token = (req.headers['authorization']).split(' ')[1];
        if (!token) {
            return next({
                status:401,
                message:"Người dùng không tồn tại"
            })
        }
        jwt.verify(token, process.env.SECRET_KEY, async function(err, user) {
            if (err){
                return next({
                    status:401,
                    message:"Người dùng không tồn tại"
                })
            }
        const userRecord = await User.findOne({ username: user.username})
        if (!userRecord) {
            return next({
                status:401,
                message:"Người dùng không tồn tại"
            })
        }
        const currentUser = userRecord.filterUserData();
        logger('info', 'Tạo thành công người dùng');
        return res.status(200).json({
            status:200,
            message:{
                validator:token,
                currentUser
                }
            })
        })       
    } 
    catch (error) {        
        return next({
            status:401,
            message:"Người dùng không tồn tại"
        })
    }
    
}

const protectedRoute = function(req, res, next){
    try {
        let token = (req.headers['authorization']).split(' ')[1];
        if (!token) {
            return next({
                status:401,
                message:"unAuthorized User"
            })
        }
        jwt.verify(token, process.env.SECRET_KEY, async function(error, decoded){
            if (decoded) {
                logger('info', 'User hiện tại được phép truy cập vào route này');
                next();
            } 
            else {
                return next({
                    status:401,
                    message:"unAuthorized User"
                })
              }   
            })     
        } 
        catch (error) {            
            return next({
                status:401,
                message:"unAuthorized User"
        })
    }
        
}


const setCurrentUser  = function(req, res, next){
    try {
        let token = (req.headers['authorization']).split(' ')[1];
        if (!token) {
            return next({
                status:401,
                message:"unAuthorized User"
            })
        }
        jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded) {
            let decodedId = decoded._id;
            let paramsId =  req.params.userId;
            if (decoded && decodedId === paramsId){     
                let user = await User.findOne({
                    username: decoded.username
                })       
                let filteredData = await user.filterUserData()
                req.currentUser = filteredData ; 
                logger('info', `User ${req.currentUser.username} đã kết nối đến server`)
                return next();
            }               
            else {
                return next({
                    status:401,
                    message:"unAuthorized User"
                })
            }
        })
    }
    catch(error){
        return next({
            status:401,
            message:"unAuthorized User"
            })
        }
    }

module.exports = {confirmAuthentication, setCurrentUser, protectedRoute}