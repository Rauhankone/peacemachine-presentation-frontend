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
  }

  componentWillMount() {
    this.socket = initSocket('input');
  }

  componentDidMount() {
    if (this.socket) {
      this.socket.on('channelUpdated', data => {
        console.log(data);
        this.setState((prevState, props) => ({
          liveTextData: [data, ...prevState.liveTextData]
        }));
        console.log('sdftu', this.state.liveTextData);
      });
    }
  }
  render() {
    return (
      <div className="presentation-view">
        <LiveTextView data={this.state.liveTextData} />
        {/* {<WordCloudView />} */}
      </div>
    );
  }
}
