import React from 'react';
import LiveTextView from './PresentationSubviews/LiveTextView';
import WordCloudView from './PresentationSubviews/WordCloudView';
// import WordZoomView from './PresentationSubviews/WordZoomView';
// import SentimentView from './PresentationSubviews/SentimentView';

import { initSocket, emitEvent, subscribeToEvent } from '../socket.config';

export default class PresentationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liveTextData: []
    };
    initSocket('presentation');
    subscribeToEvent('channelUpdated', (data) => {
      console.log(data);
      this.setState((prevState, props) => {
        liveTextData: [...prevState.liveTextData, data];
      });
    });
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
