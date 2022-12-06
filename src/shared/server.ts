import { io, serverHttp } from './http';

io.on("connection", async (socket) => {
    io.to(socket.id).emit("mySocketId", socket.id)
})

serverHttp.listen(3333, () => {
    console.log('Server started on port 3333')
})