const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const chatController = require('../controllers/chatController');
const userController = require('../controllers/userController');
const passport = require('passport');
const authenticate = passport.authenticate('jwt', { session: false });

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/search', authenticate, chatController.findPeople);
router.get('/conversation', authenticate, chatController.getConversation);
router.get('/get-messages', authenticate, chatController.getMessages);
router.get(
  '/conversation-list',
  authenticate,
  chatController.getConversationList
);
router.post('/send-message', authenticate, chatController.sendMessage);
router.get('/list', authenticate, userController.getListUser);
router.get('/update', authenticate, userController.updateUser);
router.get('/delete', authenticate, userController.deleteUser);
router.post('/getuser', authenticate, userController.getUser);
router.post('/block_chat', authenticate, userController.block_chat);




module.exports = router;
