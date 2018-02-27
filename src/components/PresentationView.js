import React from 'react';
import LiveTextView from './PresentationSubviews/LiveTextView';
import WordCloudView from './PresentationSubviews/WordCloudView';
// import WordZoomView from './PresentationSubviews/WordZoomView';
// import SentimentView from './PresentationSubviews/SentimentView';

import { socket } from '../socket.config';

export default class PresentationView extends React.Component {
  constructor(props) {
    super(props);
    this.socket = socket;
    if (this.socket) {
      socket.emit('connected', { viewName: 'presentation' }); // View identification on server
      socket.on('channelUpdated', data => {
        console.log(data);
      });
    }
  }

  render() {
    return (
      <div className="presentation-view">
        <LiveTextView />
        <WordCloudView />
      </div>
    );
  }
}
