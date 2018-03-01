import io from 'socket.io-client';

const HOST = process.env.REACT_APP_SERVER_HOST;
const PORT = process.env.REACT_APP_SERVER_PORT;

const socketConnectionUrl = `${HOST}:${PORT}`;
let socket = null;

export default {
  /**
   * @param {string} viewName the view name of the socket
   * @param {object} [moreProps] optional object to be sent to the server
   */
  initSocket: (viewName, moreProps) => {
    socket = io.connect(socketConnectionUrl, {
      query: { viewName, ...moreProps }
    });
    socket.on('connect_error', () => console.log('Websocket connection failed!'));
    socket.on('connect', () => console.log('Websocket connection successfully established!'));
  },
  /**
   * 
   * @param {string} event name of the event to emit 
   * @param {object} payload optional payload inside an object
   */
  emitEvent: (event, payload) => {
    socket.emit(event, payload);
  },
  /**
   * 
   * @param {string} event name of the event to listen for 
   * @param {function} cb callback function that is called with whatever data comes along with the event
   */
  subscribeToEvent: (event, cb) => {
    socket.on(event, data => cb(data));
  }

}