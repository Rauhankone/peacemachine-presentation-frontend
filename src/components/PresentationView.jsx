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
    topWords: []
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
      this.updateTopWords();
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
      this.updateTopWords();
    });

    socketService.subscribeToEvent('messFinalized', data => {
      const { mess } = data;
      this.setState((prevState, props) => {
        return {
          ...prevState,
          mess
        };
      });
      this.updateTopWords();
    });
  }

  updateTopWords() {
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
    let topWords = _.reverse(
      _.slice(
        _.map(
          _.sortBy(
            _.map(keywords, (w, i) => ({
              word: w,
              freq: freqs[i]
            })),
            'freq'
          ),
          wf => wf.word
        ),
        -5
      )
    );
    this.setState((prevState, props) => ({
      topWords: topWords
    }));
  }

  renderOverlay() {
    const slideViews = {
      'intensity': (
        <SentimentView title="Sentiment View" data={this.state.mess} />
      ),
      'word cloud': <WordCloudView />,
      'zoom tool': <WordZoom />,
      ...Object.assign(
        {},
        ..._.map(this.state.topWords, (word, index) => ({
          [`topword ${index + 1}`]: (
            <TopWord word={this.state.topWords[index]} />
          )
        }))
      )
    };
    return slideViews[this.state.activeSlide];
  }

  render() {
    return (
      <div className="presentation-view">
        <ActiveSlideHeader slideName={this.state.activeSlide} />
        <LiveTextView
          mess={this.state.mess}
          activeSlide={this.state.activeSlide}
        />
        <div className="overlay-container">{this.renderOverlay()}</div>
      </div>
    );
  }
}
