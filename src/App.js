import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import Input from './components/InputView';
import Director from './components/DirectorView';
import Presentation from './components/PresentationView';

import { initSocket } from './socket.config';

class App extends Component {
  constructor() {
    super();
    initSocket();
  }

  render() {
    return (
      <div className="App">
        <Route path="/input" component={Input} />
        <Route path="/director" component={Director} />
        <Route path="/presentation" component={Presentation} />
      </div>
    );
  }
}

export default App;