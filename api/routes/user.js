const express = require('express')
const route = express.Router({mergeParams: true})
const services = require('../../services')
const config = require('../../config');

route.post('/profile/edit', async function(req, res, next){
    try{
        const editedUserData = req.body;        
        const UserService = new services.UserService(editedUserData, req.params.userId)
        const currentUser = await UserService.editUser()
        req.currentUser = currentUser;
        return res.status(200).json({
            status:200,
            message:currentUser
        })
    }  
    catch (error) {
        return next(error)
    }     
})

route.get('/add-friend/:addedUserId', async function(req, res, next){
    try {
        const UserService = new services.UserService(
            req.currentUser, 
            req.params.userId, 
            req.params.addedUserId
        )
        const {currentUser, filteredOtherUserData} = await UserService.addFriend();
        return res.status(200).json({
            status:200,
            message:{
                currentUser,
                otherUser: filteredOtherUserData
            }
        })
    } 
    catch (error) {        
        return (next)
        
    }
})



    
    
module.exports = route