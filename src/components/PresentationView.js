import React from 'react';
import LiveTextView from './PresentationSubviews/LiveTextView';
import WordCloudView from './PresentationSubviews/WordCloudView';
// import WordZoomView from './PresentationSubviews/WordZoomView';
// import SentimentView from './PresentationSubviews/SentimentView';

import { initSocket } from '../socket.config';

export default class PresentationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liveTextData: []
    };
    this.socket = initSocket('presentation');
    if (this.socket) {
      this.socket.emit('connected', { viewName: 'presentation' });
      this.socket.on('channelUpdated', data => {
        console.log(data);
        this.setState((prevState, props) => ({
          liveTextData: [...prevState.liveTextData, data]
        }));
        console.log(this.state.liveTextData);
      });
    }
  }

  render() {
    return (
      <div className="presentation-view">
        <LiveTextView data={this.state.liveTextData} />
        <WordCloudView />
      </div>
    );
  }
}
