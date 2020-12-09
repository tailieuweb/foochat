const jwt = require('jsonwebtoken');
const config = require('../config');
const Models = require('../models');

class AuthService {

    constructor(user, imageUrl = null){
        this.user = user;
        this.imageUrl = imageUrl
    }

    //Cung cấp token cho user
    generateToken (user){
        const u = {
            username: user.username,
            _id: user._id.toString(),
            imageUrl: user.imageUrl
        };
        return jwt.sign(u, config.secretKey, {
           expiresIn: 60 * 60 * 24 
        });
    }

    //Hàm kết nối trực tiếp với admin sau khi user đăng nhập vào
    async addAdminToUser(currentUser){
        let adminUser  = await Models.User.findOne({
            isAdmin:true
        })
        let filteredAdminUser = await adminUser.filterUserData()
        let filteredCurrentUser = await currentUser.filterUserData()
        await adminUser.addFriend(filteredCurrentUser)
        await currentUser.addFriend(filteredAdminUser)
    }

    //Hàm đăng kí
    async SignUp() {
        let newUser = await Models.User.create(this.user);
        await newUser.encryptPassword()
        newUser.userImage = this.imageUrl;
        newUser = await newUser.save();
        if (newUser.username === 'admin') {
            newUser.isAdmin = true
        } else {
            await this.addAdminToUser(newUser)
        }
        newUser = await newUser.save();
        const generatedToken = this.generateToken(newUser)
        newUser = await newUser.filterUserData()
        return {newUser, generatedToken}
    }

    //Hàm đăng nhập
    async SignIn() {
        const {email, password} = this.user;
        const userRecord = await Models.User.findOne({email})
        if (!userRecord){
            throw new Error('Người dùng không tồn tại');
        }
        let isMatched = await userRecord.comparePassword(password);        
        if(isMatched){
            const generatedToken = this.generateToken(userRecord);
            const currentUser = userRecord.filterUserData();
            return {currentUser, generatedToken}
        }
        else {
            throw new Error('Email/Password không chính xác');
        }
  }

}



module.exports = AuthService;