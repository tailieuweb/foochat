const loggerFunction = require('./logger')
const services = require('../services')
const sockets = {};

function setRoomEvent(socket) {
    socket.on('setRooms', async () => { 
        const result = await services.ChatService.setRooms()    
        loggerFunction('info', result)
    })
}

function getAllOnlineUsersEvent(socket, io) {
    socket.on('getOnlineUsers', async ()=>{  
        const {users, onlineUsers} = await services.ChatService.getOnlineUsers()    
            io.emit('onlineUsers', {
                users,
                usersStatus: onlineUsers
                }
            )
         ;
    })
}

function setUserSocketIdEvent(socket, io){
    socket.on('login',async ({username},callback) => {   
        console.log(username,socket.id) 
        await services.ChatService.setUserSocketId(username, socket.id)
        io.emit('changeOnlineUsers')
    })
}


function createRoomEvent(socket){
    socket.on('create', async ({roomName}, callback) =>{
        await services.ChatService.createRoom(roomName)
        }
    )   
}


function enterRoomEvent(socket, io){
    socket.on('enter', async ({username, roomId}) =>{     
        const room = await services.ChatService.joinRoom(username, socket.id, roomId)
        socket.join(room[0].name)
        io.to(room[0].name).emit('updateRoomMemberStatus', room[0]) 
        socket.to(room).emit('updateRoomMemberStatus', room)               
              
    })
}

function privateMessageEvent(socket, io){
    socket.on('messageUser', async ({message,receiver,sender,location}, callback) =>{
        let date = new Date();
        const {userSender, socketId} = await services.ChatService.getUserSocketId(receiver, sender)
        io.to(socketId).emit('privateMessage', {
            text: message,
            createdAt: date.toISOString(),
            createdBy: sender,
            senderProfile: userSender,
            sentTo: receiver,
            location
        })     
        callback()
        }
    )
}

function groupMessageEvent(socket, io){
    socket.on('messageToGroup', async ({message,senderId, groupId}) =>{ 
        let date = new Date();
        const {room, username} = await services.ChatService.getRoomInfo(senderId, groupId)
        io.in(room.name).emit('groupMessage', {
                text: message,
                createdAt: date.toISOString(),
                groupName: room,
                createdBy: username,
        })
    })       
}

function currentUserOnlineFiendsEvent(socket){
    socket.on('getOnlineFriends', async (username, callback)=>{
        const onlineFriends = await services.ChatService.currentUserOnlineFriends(
            senderId, 
            groupId
        )
        callback(onlineFriends)
    })
}

function setAllUser(socket){
    socket.on('allUsers', async() =>{
        const allUsers = await services.ChatService.getAllUsers()
        console.log(allUsers.length)
        socket.broadcast.emit('setAllUsers',{
            allUsers
        })
    })
}
function updateParticularUsersData(socket, io) {
    socket.on('updateUserData', async ({userData}) =>{
        if(userData.socketId) {
            io.to(userData.socketId).emit('setUserData', {
             userData
                })     
            }
        }
    )
}

function onDisconnect(socket, io) {
    services.ChatService.logOutCurrentUser(socket.id);
    io.emit('changeOnlineUsers')
    loggerFunction('info', `Socket ${socket.id} disconnected`)
}

sockets.init = function (server) {
    const io = require('socket.io').listen(server);
    io.on('connection', function (socket) {
        
        loggerFunction('info', `Socket ${socket.id} connected`);
        setRoomEvent(socket);
        getAllOnlineUsersEvent(socket, io);
        setUserSocketIdEvent(socket, io);
        privateMessageEvent(socket, io)
        groupMessageEvent(socket, io)
        currentUserOnlineFiendsEvent(socket)
        updateParticularUsersData(socket, io)
        setAllUser(socket)
        

        socket.on('disconnect', function () {
            onDisconnect(socket, io);
        });

  });
    

}

module.exports = sockets;

