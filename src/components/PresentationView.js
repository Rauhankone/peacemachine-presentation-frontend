import React from 'react';
import ReactDOM from 'react-dom';

import LiveTextView from './PresentationSubviews/LiveTextView';
import WordZoomView from './PresentationSubviews/WordZoomView';
import WordCloudView from './PresentationSubviews/WordCloudView';
import SentimentView from './PresentationSubviews/SentimentView';

import { socket } from '../socket.config';

export default class PresentationView extends React.Component {

  constructor(props) {
    super(props);
    this.socket = socket;
    if (this.socket) {
      socket.emit('connected', { viewName: 'presentation' }); // View identification on server
    }
  }

  render() {
    return (
      <div className="presentation-view"><LiveTextView /></div>
    )
  }

};