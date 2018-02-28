import React from 'react';
import LiveTextView from './PresentationSubviews/LiveTextView';
import WordCloudView from './PresentationSubviews/WordCloudView';
// import WordZoomView from './PresentationSubviews/WordZoomView';
// import SentimentView from './PresentationSubviews/SentimentView';

import { initSocket, subscribeToEvent } from '../socket.config';

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

  componentDidMount() {
    // this.timer = setInterval(() => {
    //   this.setState((prevState, props) => ({
    //     liveTextData: [
    //       {
    //         confidence: 1.0,
    //         id: 'fddfsgfd',
    //         transcript: `foobar ${Math.random() * 10000} ${Math.random() *
    //           10000} ${Math.random() * 10000} ${Math.random() *
    //           10000}${Math.random() * 10000}`
    //       },
    //       ...prevState.liveTextData
    //     ]
    //   }));
    // }, 3000);
  }
  render() {
    return (
      <div className="presentation-view">
        <LiveTextView data={this.state.liveTextData} />
        {
          //<WordCloudView />
        }
      </div>
    );
  }
}
