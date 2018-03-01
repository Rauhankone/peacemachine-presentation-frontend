import React from 'react';
import LiveTextView from './PresentationSubviews/LiveTextView';
import WordCloudView from './PresentationSubviews/WordCloudView';
// import WordZoomView from './PresentationSubviews/WordZoomView';
// import SentimentView from './PresentationSubviews/SentimentView';

import socketService from '../services/socket-service';

export default class PresentationView extends React.Component {
  constructor(props) {
    super(props);
    socketService.initSocket('presentation');
    socketService.subscribeToEvent('channelUpdated', (data) => {
      console.log(data);
      this.createChannel(data);
    });
  }

  state = {
    channels: []
  };

  createChannel = newChannel => {
    this.setState((prevState, props) => {
      const channelExist = prevState.channels
        .map(channel => channel.id)
        .filter(channelId => newChannel.id === channelId)
        .some(value => value);

      const maxChannels = 3;

      console.log('channelExist', channelExist);

      if (!channelExist) {
        return this.state.channels.length < maxChannels
          ? {
              channels: [...prevState.channels, newChannel]
            }
          : {
              channels: [newChannel, ...prevState.channels.slice(0, 2)]
            };
      } else {
        return console.error(`channel already exists in state`);
      }
    });
  };

  render() {
    return (
      <div className="presentation-view">
        <LiveTextView channels={this.state.channels} />
        {/* {<WordCloudView />} */}
      </div>
    );
  }
}
