const express = require('express');
const route = express.Router({mergeParams: true});
const Model = require('../../models');
const logger = require('../../loaders/logger')


route.get('/groups', async (req, res, next)  => {
    try {
        const groups = await Model.Group.find();
        logger('info', 'Tất cả các group trong model group từ database')
        return res.status(200).json({
            status:200,
            message:groups
        })    
    } 
     catch (error) {
        return next(error)
    } 
})

route.get('/users', async function(req, res, next){
    try {
        let users = await Model.User.find() 
        let filteredData =  await Model.User.filterData(users);
        logger('info', 'Danh sách các users trong model user từ database')
        return res.status(200).json({
            status:200,
            message:filteredData
        })
    } catch (error) {
        return next(error)    
        }
    }
)


module.exports = route