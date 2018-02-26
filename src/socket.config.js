import io from 'socket.io-client';

const socket = io.connect(`${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`);

export default socket;