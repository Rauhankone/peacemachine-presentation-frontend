import React from 'react';

import ActiveSlideHeader from './PresentationView/ActiveSlideHeader';

import LiveTextView from './PresentationView/LiveTextView';
import WordCloudView from './PresentationView/WordCloudView';
import SentimentView from './PresentationView/SentimentView';

import WordZoom from './PresentationView/Overlay/WordZoom';
import TopWord from './PresentationView/Overlay/TopWord';

import _ from 'lodash';
import KeywordExtractor from 'keyword-extractor';

import socketService from '../services/socket-service';
import '../styles/Overlay.css';

export default class PresentationView extends React.Component {
  constructor(props) {
    super(props);
    socketService.initSocket('presentation');
    this.presentationSocketSetup();
  }

  state = {
    channels: [
      {
        id: '',
        confidence: 0,
        transcript: '',
        fullTranscript: ''
      }
      /*...*/
    ],
    mess: [],
    activeSlide: 'live text',
    topWords: null
  };

  presentationSocketSetup() {
    socketService.subscribeToEvent('channelUpdated', data => {
      this.setState(prevState => {
        const id = prevState.channels.findIndex(ch => ch.id === data.id);
        if (prevState.channels[id]) prevState.channels[id] = data;
        return {
          channels: prevState.channels,
          mess: [
            ...prevState.mess,
            {
              id: data.id,
              confidence: data.confidence,
              transcript: data.transcript,
              timestamp: Date.now()
            }
          ]
        };
      });
    });

    socketService.subscribeToEvent('slideUpdated', data => {
      this.setState({ activeSlide: data.slideName });
    });

    socketService.subscribeToEvent('channelCandidacyUpdated', data => {
      this.setState(prevState => {
        let channels =
          prevState.channels.length < 3 && data.candidate
            ? [...prevState.channels, data]
            : prevState.channels.filter(ch => ch.id !== data.id);
        return { channels };
      });
    });

    socketService.subscribeToEvent('channelDisconnected', data => {
      console.log('Channel disconnected!');
      console.log(data);
      this.setState(prevState => ({
        channels: prevState.channels.filter(ch => ch.id !== data.id)
      }));
    });

    socketService.subscribeToEvent('initStoreProps', data => {
      let appointedChannels = data.channels.filter(ch => {
        return ch.candidate;
      });
      this.setState({
        channels: appointedChannels,
        activeSlide: data.slides.activeSlide,
        mess: data.mess
      });
    });

    socketService.subscribeToEvent('messFinalized', data => {
      const { mess } = data;
      console.log('dfd', { topWords: this.getTopWords() });
      this.setState((prevState, props) => {
        return {
          ...prevState,
          mess
        };
      });
    });
  }

  getTopWords() {
    let fullText = _.lowerCase(
      _.join(_.map(this.state.mess, x => x.transcript), ' ')
    );
    const words = _.words(fullText);
    const keywords = KeywordExtractor.extract(fullText, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true
    });
    const freqs = _.map(keywords, kw =>
      _.reduce(words, (freq, w) => (w === kw ? freq + 1 : freq), 0)
    );

    return _.reverse(
      _.slice(
        _.sortBy(
          _.map(keywords, (w, i) => ({
            word: w,
            freq: freqs[i]
          })),
          'freq'
        ),
        -5
      )
    );
  }

  renderOverlay() {
    const slideViews = {
      'sentiment analysis': (
        <SentimentView title="Sentiment View" data={this.state.mess} />
      ),
      'word cloud': <WordCloudView />,
      'zoom tool': <WordZoom />,
      'topword 1': this.state.topWords ? (
        <TopWord word={this.state.topWords[0].word} />
      ) : null,
      'topword 2': this.state.topWords ? (
        <TopWord word={this.state.topWords[1].word} />
      ) : null,
      'topword 3': this.state.topWords ? (
        <TopWord word={this.state.topWords[2].word} />
      ) : null,
      'topword 4': this.state.topWords ? (
        <TopWord word={this.state.topWords[3].word} />
      ) : null,
      'topword 5': this.state.topWords ? (
        <TopWord word={this.state.topWords[4].word} />
      ) : null
    };
    return slideViews[this.state.activeSlide];
  }

  render() {
    return (
      <div className="presentation-view">
        <ActiveSlideHeader slideName={this.state.activeSlide} />
        <LiveTextView mess={this.state.mess} />
        <div className="overlay-container">{this.renderOverlay()}</div>
      </div>
    );
  }
}
