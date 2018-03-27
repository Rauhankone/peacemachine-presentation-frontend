import React from 'react';

import ActiveSlideHeader from './PresentationView/ActiveSlideHeader';

import LiveTextView from './PresentationView/LiveTextView';
import WordCloudView from './PresentationView/WordCloudView';
import SentimentView from './PresentationView/SentimentView';

import WordZoom from './PresentationView/Overlay/WordZoom';
import TopWord from './PresentationView/Overlay/TopWord';

import _ from 'lodash';

import socketService from '../services/socket-service';
import { genTopWords } from '../utils';
import '../styles/Overlay.css';

export default class PresentationView extends React.Component {
  static loopSlides = [
    'live text',
    'confidence',
    'intensity',
    'topword 1',
    'topword 2',
    'topword 3',
    'topword 4',
    'topword 5'
  ];

  static loopSlideTransitionMilliseconds = 5000;

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
    loopSlideIndex: 0,
    topWords: []
  };

  get visibleSlide() {
    if (this.state.activeSlide === 'loop') {
      return PresentationView.loopSlides[this.state.loopSlideIndex];
    } else {
      return this.state.activeSlide;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeSlide !== prevState.activeSlide) {
      if (this.state.activeSlide === 'loop') {
        this.moveToNextLoopSlideIntervalId = setInterval(
          this.moveToNextLoopSlide,
          PresentationView.loopSlideTransitionMilliseconds
        );
      } else {
        clearInterval(this.moveToNextLoopSlideIntervalId);
      }
    }
  }

  moveToNextLoopSlide = () => {
    this.setState(prevState => {
      let { loopSlideIndex } = prevState;
      loopSlideIndex++;
      if (PresentationView.loopSlides.length <= loopSlideIndex) {
        loopSlideIndex = 0;
      }
      return { loopSlideIndex };
    });
  };

  presentationSocketSetup() {
    socketService.subscribeToEvent('channelUpdated', data => {
      //console.log('channelUpdated', data);
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
      this.setState({
        activeSlide: data.slideName,
        loopSlideIndex: 0
      });
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
        loopSlideIndex: 0,
        mess: data.mess
      });
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
    this.setState(prevState => ({
      topWords: genTopWords(this.state.mess)
    }));
  }

  getTopWord() {
    let topWordRegex = /topword (\d+)/;
    let parts = topWordRegex.exec(this.visibleSlide);
    if (!!parts) {
      let index = parseInt(parts[1]) - 1;
      if (this.state.topWords.length > index) {
        return this.state.topWords[index];
      }
    }
    return '';
  }

  renderOverlay() {
    const slideViews = {
      intensity: (
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
    return slideViews[this.visibleSlide];
  }

  render() {
    return (
      <div className="presentation-view">
        <ActiveSlideHeader slideName={this.visibleSlide} />
        <LiveTextView
          mess={this.state.mess}
          activeSlide={this.visibleSlide}
          topWord={this.getTopWord()}
        />
        <div className="overlay-container">{this.renderOverlay()}</div>
      </div>
    );
  }
}
