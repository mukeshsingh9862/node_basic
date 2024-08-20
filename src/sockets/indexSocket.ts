import { veirfyTokenKey } from "./helperSocket";

const activeUsers: any = [];
export = (io: any) => {

    return io.on('connection', async (socket: any) => {

        let token = socket.handshake.query.access_token;
        let result: any = await veirfyTokenKey(token);

        if (token && result.status) {
            activeUsers[result?.data?.id] = socket.id;
            console.log(result?.data?.id, socket.id, 'new socket connected');
            console.log(activeUsers)

            socket.to(socket.id).emit('socket_status', { status: true, message: "Socket Connected!", data: { userId: result?.data?.id } }); 
            socket.to(socket.id).emit('success_status', { message: "Socket Connected!", data: null });      // send to the particular socket id
            // socket.broadcast.emit('success_status', { message: "Socket Connected!", data: null })        // send to the broadcast message to every one

        } else {
            console.log('Connection refused, Token not valid or Token Expired');
            socket.disconnect(true); // Disconnect the client
        }

        socket.on('streamline_update', () => {
            
            console.log("streamline log.....")
            // socket.broadcast.emit('streamline_response', {})

            socket.to(socket.id).emit('streamline_response', { status: true, message: "Socket Connected!", data: { userId: result?.data?.id } });
            // socket.broadcast.emit('streamline_response', { status: true, message: "Streamline Balance Updated!", data: null });

        });


        socket.on('startRecording', function (callbackFn:any) {
            socket.broadcast.emit('startREcording_response', { message: "startREcording Connected!", data: null })
            callbackFn({ message: "testing >>>>>>>" });
        });


        socket.on('disconnect', async () => {
            console.log("socket disconnected.....")

            if (socket.userId) {
                socket.emit('disconnected');
                socket.disconnect(true);
            } else {
                socket.to(socket.id).emit('error_status', { status: true, message: "Socket connection failed!!", data: null });
            }
        });
    });

}