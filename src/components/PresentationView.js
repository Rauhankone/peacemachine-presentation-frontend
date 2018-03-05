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
    socketService.subscribeToEvent('channelCandidacyUpdated', (data) => {
      this.setState(prevState => {
        let channels = prevState.channels.length < 3 && data.candidate ?
          [...prevState.channels, data] :
          prevState.channels.filter((ch) => ch.id !== data.id);
          return { channels };
      });
    });
    socketService.subscribeToEvent('initStoreProps', (data) => {
      let appointedChannels = data.channels.filter((ch) => {
        return ch.candidate;
      });
      this.setState({ channels: appointedChannels, activeSlide: data.slides.activeSlide });
    });
  }

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