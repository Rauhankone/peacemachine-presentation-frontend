import dotenv from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import io from 'socket.io-client';

require('dotenv').config();

console.log(dotenv);

// const socket = io.connect('192.168.20.60:8080');
// socket.on('foo', data => {
//  console.log(data);
//  socket.emit('bar', { my: 'data' });
// });

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
