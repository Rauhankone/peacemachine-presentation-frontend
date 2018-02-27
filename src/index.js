import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import io from 'socket.io-client';

// const socket = io.connect(`${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`);
// socket.on('foo', data => {
//  console.log(data);
//  socket.emit('bar', { my: 'data' });
// });

ReactDOM.render((
  <BrowserRouter>
    <App props/>
  </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
