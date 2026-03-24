import { Server as SocketIOServer } from "socket.io";

let io;

export const initSocketServer = (server) => {
    io = new SocketIOServer(server);

    io.on("connection", (socket) => {
        console.log("A user is connected!!");

        socket.on("notification", (data) => {
            io.emit("newNotification", data);
        });

        socket.on("disconnect", () => {
            console.log("A user is disconnected!!");
        });
    });
};

export { io };
