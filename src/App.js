import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';

import Input from './components/InputView';
import Director from './components/DirectorView';
import Presentation from './components/PresentationView';

class App extends Component {
  
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
