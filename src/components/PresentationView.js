import React from 'react';
import LiveTextView from './PresentationSubviews/LiveTextView';
import WordCloudView from './PresentationSubviews/WordCloudView';
import WordZoomView from './PresentationSubviews/WordZoomView';
import SentimentView from './PresentationSubviews/SentimentView';

import socketService from '../services/socket-service';

export default class PresentationView extends React.Component {
  constructor(props) {
    super(props);
    socketService.initSocket('presentation');
    this.presentationSocketSetup();
  }

  state = {
    channels: [],
    activeSlide: 'live text'
  };

  presentationSocketSetup() {
    socketService.subscribeToEvent('channelInitialized', (data) => {
      console.log(data);
      this.createChannel(data);
    });
    socketService.subscribeToEvent('channelUpdated', (data) => {
      this.setState(prevState => {
        const id = prevState.channels.findIndex((ch) => ch.id === data.id);
        if (prevState.channels[id]) prevState.channels[id] = data;
        return {
          channels: prevState.channels
        };
      });
    });
    socketService.subscribeToEvent('slideUpdated', (data) => {
      this.setState({ activeSlide: data.slideName });
    });
    socketService.subscribeToEvent('initStoreProps', (data) => {
      this.setState({channels: data.channels, activeSlide: data.slides.activeSlide});
    });
  }

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

  renderSubviewComponent() {
    const slideViews = {
      'live text': <LiveTextView channels={this.state.channels} />,
      'sentiment analysis': <SentimentView />,
      'word cloud': <WordCloudView />,
      'zoom tool': <WordZoomView />
    }
    return slideViews[this.state.activeSlide];
  }

  render() {
    return (
      <div className="presentation-view">
        <p>{this.state.activeSlide}</p>
        {this.renderSubviewComponent()}
      </div>
    );
  }
}