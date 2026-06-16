import http from "http"
import express from "express"
import { Server } from "socket.io"

const app= express()
const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:"https://nexo-frontend-lvqq.onrender.com",
        methods:["GET","POST"],
          credentials: true,
    }
})

const userSocketMap={}

export const getSocketId=(receiverId) => {
    return userSocketMap[receiverId]
}




io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) return;

    // save user online
    userSocketMap[userId] = socket.id;

    const getOnlineUsers = () => Object.keys(userSocketMap);

    // NEW USER gets current online list
    socket.emit("getOnlineUsers", getOnlineUsers());

    // everyone else also gets update
    io.emit("getOnlineUsers", getOnlineUsers());

    socket.on("disconnect", () => {
        delete userSocketMap[userId];

        io.emit("getOnlineUsers", getOnlineUsers());
    });
});

export {app, io,server}
