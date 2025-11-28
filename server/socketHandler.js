const calculateDistanceAndEta = require('./controllers/locationController')
let roomUsers = {}

const handelSocketConnection = (socket, io) => {
    console.log('A user is connected:', socket.id);
    socket.on('join:room', (roomId) => {
        socket.join(roomId);
        socket.roomId = roomId
        if (!roomUsers[roomId]) {
            roomUsers[roomId] = {} //creating a room if not exists 
        }
        roomUsers[roomId][socket.id] = {}
    })
    socket.on('location:Update', async (data) => {
        const { lat, lng } = data;
        const roomId = socket.roomId
        if (!roomId) {
            return;
        }
        roomUsers[roomId][socket.id] = { lat, lng };//else setting the lat and longitude of the roomId

        const users = roomUsers[roomId];
        const updateUsers = await Promise.all(
            Object.keys(users).map(async (id) => {
                let distance = null;
                let duration = null;
                if (users[socket.id] && users[id]) {
                    try {
                        if (id !== socket.id) {
                            const result = await calculateDistanceAndEta(users[id], users[socket.id]);//origin,destination
                            distance = result.distance;
                            duration = result.duration
                        }
                    } catch (error) {
                        distance = 'N/A';
                        duration = 'N/A';
                    }
                }
                return {
                    userId: id,
                    lat: users[id].lat,
                    lng: users[id].lng,
                    distance,
                    eta: duration //estimated time
                }
            })
        )
        io.to(roomId).emit('locationUpdate', updateUsers);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const roomId = socket.roomId;

        if (roomId && roomUsers[roomId]) {
            delete roomUsers[roomId][socket.id];

            io.to(roomId).emit('user-offline', Object.keys(roomUsers[roomId]).map(id=>({
                userId:id,
                ...roomUsers[roomId][id]
            
        })));

            if (Object.keys(roomUsers[roomId]).length === 0) {
                delete roomUsers[roomId]; // Remove the room if no users left
            }
        }
    });

} 

module.exports = handelSocketConnection