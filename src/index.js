import React from 'react';
import ReactDOM from 'react-dom';
import 'nanoreset';
import './index.css';
import './App.css';

import registerServiceWorker from './registerServiceWorker';
import Router from './components/Router';

import fontawesome from '@fortawesome/fontawesome';
import faRegular from '@fortawesome/fontawesome-free-regular';

fontawesome.library.add(faRegular);

ReactDOM.render(<Router />, document.getElementById('root'));
registerServiceWorker();
