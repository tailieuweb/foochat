const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type: String,
        required:true,
        unique:true
    },
    socketId:{
        type: String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    userImage:{
        type:String,
    },
    lastOnline:{
        type:Date
    },
    isAdmin:{
        type:Boolean
    },
    friends:[
        {
            userInfo:{},
            messages:[]
        }
    ],
},
{
    timestamps:true
})

//Hàm mã hoá password
userSchema.methods.encryptPassword =  async function(req, res, next){
    try {
        
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword
    } catch (error) {
        return next(error)
    }
    
}

//Hàm so sánh mật khẩu nhập lại
userSchema.methods.comparePassword = async function (userConfirmPassword, next) {
    try {
        
        let passwordCheck = await bcrypt.compare(userConfirmPassword, this.password)                
        return passwordCheck;

    } catch (error) {
        return next(error)

    }
}
//Hàm upload avatar
userSchema.methods.uploadImage =  function(imageBuffer){
    try {
        this.userImage = imageBuffer
    } catch (error) {
        // return next(error);
        console.log(error);
    }
}
//Hàm thêm bạn bè
userSchema.methods.addFriend = async function(friend) {
    try {
        let updatedFriendList = [...this.friends]
        let existingFriend = updatedFriendList.findIndex((friendList)=>(
            friendList.userInfo._id.toString() === friend._id.toString()
        ))
        if (existingFriend !== -1){
            return;
        }
 
        updatedFriendList.push({
            userInfo:friend,
            messages:[]
        })
        this.friends = updatedFriendList;
        return this.save()

    } catch (error) {        
        return (error)   
    }
    
}

//Hàm lưu tin nhắn
userSchema.methods.saveMessage = function(user, message, type) {
    try {
        let friends = [...this.friends]
        let friendIndex = friends.findIndex((friend)=>(
            friend.userInfo.username === user.username
        ))
        if (friendIndex !== -1){
            friends[friendIndex].messages.push(message)
        }
        this.friends = friends;
        return this.save()
        
    } catch (error) { 
        console.log(error);
    }
}

// lấy ra tin nhắn khi 2 user thành bạn bè
userSchema.methods.getMessages = function(user) {
    try {
        let messages = []
        let friendIndex = this.friends.findIndex((friend)=>(
            friend.userInfo.username === user.username
        ))
        
        if (friendIndex !== -1){
            messages = this.friends[friendIndex].messages
        }        
        return messages;
        
    } catch (error) {
        console.log(error);
    }
    

}

//Hàm lọc data để login
userSchema.methods.filterUserData = function() {

        let obj = this.toObject();
        delete obj.password;
        delete obj.email;
        return obj;
}

//Hàm lọc data lấy ra socketid để chat
userSchema.statics.filterData = function(users) {
        try {
            return users.map((user)=>{
                let obj = user.toObject();        
                delete obj.socketId
                delete obj.password;
                delete obj.email;
                return obj;
    })  
        } catch (error) {
            console.log(error);
            
        }
          
}

module.exports = mongoose.model('User', userSchema);