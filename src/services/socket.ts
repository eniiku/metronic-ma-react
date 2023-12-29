import { io, Socket } from 'socket.io-client'

let socket: Socket

// const BASE_URL = "https://api.marketaction.live/"
const BASE_URL = 'http://localhost:3000/'

export const initSocket = () => {
  socket = io(BASE_URL, {
    transports: ['polling'],
  }) // Temporary development url

  socket.on('connect', () => {
    console.log(`Socket ${socket.id} connected✅`)

    // Send a message to the server
    socket.emit('message', 'Connected Successfully!!')
  })

  socket.on('disconnect', (reason) => {
    console.log(`Socket ${socket.id} disconnected❌`)
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect()
    }
    // else the socket will automatically try to reconnect
  })

  return socket
}

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket is not initialized. Call initSocket() first.')
  }

  return socket
}
