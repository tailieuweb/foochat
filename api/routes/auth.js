const express = require('express');
const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require ('cloudinary');
const route = express.Router({mergeParams: true})
const services = require('../../services');
const logger = require('../../loaders/logger');


const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: 'snagged',
	filename: function (req, file, cb) {
		cb(undefined, `${file.originalname.split('.'[0])}`);
	}
});

const upload = multer({ 
	storage: storage,
		limits: {
			fileSize: 5 * 1024 * 1024,
	},
})

var cpUpload = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'data', maxCount: 5 }])

route.post('/register', cpUpload, async function(req, res, next){
	try {
			const file = req.files.file;
			if (!file) {
				throw new Error('Không được để trống, vui lòng upload ảnh lên')
			}
			const imageUrl = req.files.file[0].url; 
			console.log(file)
			let userData= JSON.parse(req.body.data);
			const User = new services.AuthService(userData, imageUrl);
			const {newUser, generatedToken} = await User.SignUp();
			logger(`info`, `New User  ${userData.username} đã được tạo thành công`)
			return res.status(200).json({
				status:200,
				message:{
				validator:generatedToken,
				currentUser:newUser
				}
			})
	} 
	catch (error) {                        
		if (error.code ===11000) {
			error.message = 'email hoặc username đã tồn tại' ;
		}
		return next({
				status:500,
				message:error.message
		})
	}
})

route.post('/login', async function(req, res, next){
	try {
		const User = new services.AuthService(req.body)
		const {currentUser, generatedToken} = await User.SignIn();
		logger(`info`, ` ${currentUser.username} đã đăng nhập`)
		return res.status(200).json({
			status:200,
			message:{
			validator:generatedToken,
			currentUser
			}
		})
	} 
	catch (error) {                        
		return next({
			status:500,
			message:error.message
		})
	}
})

module.exports = route