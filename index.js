const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app); 
const io = require("socket.io")(http); 

app.use(express.static(path.join(__dirname, "/public"))); 


let users = {};


const port = process.env.PORT || 3001;
http.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});



io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado: ", socket.id); 

    socket.on("newuser", (username) => {
        users[socket.id] = username; 
        console.log(`${username} se unió al chat`); 
        socket.broadcast.emit("newuser", username + " se unió al chat");

        const otherUsers = Object.keys(users).filter((id) => id !== socket.id);
        if (otherUsers.length > 0) {
            const otherUsername = users[otherUsers[0]];
            socket.emit("update-header", otherUsername); 
            io.to(otherUsers[0]).emit("update-header", username); 
        }
    });

    socket.on("chat", (data) => {
        console.log(`Mensaje de ${data.username}: ${data.text}`); 
        socket.broadcast.emit("chat", data); 
    });

    socket.on("disconnect", () => {
        const username = users[socket.id];
        delete users[socket.id]; 
        console.log(`${username} dejó la conversación`); 
        socket.broadcast.emit("actualizar", `${username} dejó la conversación`);
    });
});
