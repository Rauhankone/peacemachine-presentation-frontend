import io from 'socket.io-client';

const HOST = process.env.REACT_APP_SERVER_HOST;
const PORT = process.env.REACT_APP_SERVER_PORT;

const socketConnectionUrl = `${HOST}:${PORT}`;

/**
 * @param {string} viewName the view name of the socket
 * @param {object} [moreProps] optional object to be sent to the server
 */
export const initSocket = (viewName, moreProps) => {
  return io.connect(socketConnectionUrl, {
    query: { viewName, ...moreProps }
  });
};