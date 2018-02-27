import io from 'socket.io-client';

let socket;
const initSocket = () => (socket = io.connect(`${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`));

export {
  socket, initSocket
}