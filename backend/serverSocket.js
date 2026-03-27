import { Server as SocketIOServer } from "socket.io";

let io;

export const initSocketServer = (server) => {
    io = new SocketIOServer(server);

    io.on("connection", (socket) => {
        console.log("A user is connected!!");

        socket.on("join", ({ userId, role }) => {
            if (userId) {
                socket.join(userId);
                console.log(`User ${userId} joined their private room.`);
            }
            if (role) {
                socket.join(role);
                console.log(`User joined ${role} room.`);
            }
        });

        socket.on("notification", (data) => {
            // If data has a user ID, send to that user's room
            if (data.user) {
                io.to(data.user).emit("newNotification", data);
            } else if (data.role) {
                // If it has a role, send to that role room
                io.to(data.role).emit("newNotification", data);
            } else {
                // Default to global
                io.emit("newNotification", data);
            }
        });

        socket.on("disconnect", () => {
            console.log("A user is disconnected!!");
        });
    });
};

export { io };
