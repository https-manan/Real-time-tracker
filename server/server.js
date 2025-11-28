const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const handelSocketConnection = require('./socketHandler')
const app = express();
const server = http.createServer(app);

const io = new Server(server,{cors:true})

io.on('connection',(socket)=>{
    console.log('Socket connected',socket.id )
    handelSocketConnection(socket,io)
    socket.on('disconnect',()=>{
        console.log("socket disconnected",socket.id)
    })
})

