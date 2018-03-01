import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import 'nanoreset';
import './App.css';

import './styles/DirectorView.css';

import Input from './components/InputView';
import Director from './components/DirectorView';
import Presentation from './components/PresentationView';

import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faRegular from '@fortawesome/fontawesome-pro-regular';

fontawesome.library.add(faRegular);

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
