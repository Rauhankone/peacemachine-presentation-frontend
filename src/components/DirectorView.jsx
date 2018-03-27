import React from 'react';

import {
  slugify,
  capitalize,
  genTopWords
  // genTopWordsFullTranscript
} from '../utils';

import axios from '../services/axios';
import socketService from '../services/socket-service';
import DocumentPanel from './DocumentPanel';
import '../styles/DirectorView.css';
import Icon from '@fortawesome/react-fontawesome';
import _ from 'lodash';

export default class DirectorView extends React.Component {
  constructor(props) {
    super(props);
    socketService.initSocket('director');

    this.directorSocket();

    this.getUserDocumentation();
  }

  state = {
    channels: [],
    slides: [],
    activeSlide: null,
    appointedChannels: [],
    maxCandidateChannels: 3,
    topWords: [],
    markdownDoc: ''
  };

  getUserDocumentation = async () => {
    try {
      const { data } = await axios.get('/doc');

      this.setState({ markdownDoc: data });
    } catch (error) {
      console.error(error);
    }
  };

  updateTopWords() {
    this.setState(prevState => ({
      topWords: genTopWords(this.state.mess)
    }));
  }

  directorSocket = () => {
    socketService.subscribeToEvent('channelInitialized', data => {
      this.setState(prevState => ({
        channels: prevState.channels.concat(data)
      }));
    });

    socketService.subscribeToEvent('channelDisconnected', data => {
      this.setState(prevState => {
        let i = prevState.channels.findIndex(el => el.id === data.id);
        if (i > -1) {
          prevState.channels.splice(i, 1);
        }
        return {
          channels: prevState.channels
        };
      });
    });

    socketService.subscribeToEvent('initStoreProps', data => {
      console.log('data is');
      console.log(data);
      this.setState(prevState => {
        let appointedChannels = data.channels.filter(el => el.candidate);

        console.log(data.channels);

        return {
          slides: data.slides.allSlides,
          activeSlide: data.slides.activeSlide,
          channels: data.channels,
          appointedChannels
        };
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

    socketService.subscribeToEvent('channelCandidacyUpdated', data => {
      console.log('channelCandidacyUpdated', data);
      this.setState(({ appointedChannels }) => {
        return !appointedChannels.includes(data.id)
          ? {
              appointedChannels: [...appointedChannels, data.id]
            }
          : {
              appointedChannels: [
                ...appointedChannels.filter(c => c !== data.id)
              ]
            };
      });
    });

    socketService.subscribeToEvent('channelRecordingChange', data => {
      this.setState(prevState => {
        const i = prevState.channels.findIndex(el => el.id === data.id);

        if (prevState.channels[i])
          prevState.channels[i].recording = data.recording;
        return {
          channels: [...prevState.channels]
        };
      });
    });
  };

  setTranscriptClientPosition = (id, x, y) => {
    this.setState(prevState => {
      const i = prevState.mess.findIndex(el => el.id === id);

      prevState.mess[i].clientPosition = { x, y };

      return {
        mess: [...prevState.mess]
      };
    });
  };

  handleSlideClick = slide => event => {
    this.setState({ activeSlide: slide });

    socketService.emitEvent('changeSlide', { slideName: slide });
  };

  handleChannelClick = channelId => event => {
    socketService.emitEvent('channelCandidacyChanged', {
      id: channelId,
      candidate: !this.state.appointedChannels.includes(channelId)
    });
  };

  handleFinalizeTonesClick = () => {
    socketService.emitEvent('finalizeMess');
  };

  getChannelHighlight = channel => {
    const appointed = this.state.appointedChannels.includes(channel.id);
    const analyzed = channel.recording === 'analyzed';

    return {
      highlight: {
        backgroundColor: appointed ? 'rgba(59, 153, 252, 0.15)' : null
      },
      label: {
        color: analyzed ? 'white' : appointed ? 'rgba(59, 153, 252, 1)' : null,
        backgroundColor: analyzed ? 'rgba(59, 153, 252, 1)' : 'initial'
      }
    };
  };

  get someChannelAnalyzed() {
    return this.state.channels
      .map(ch => ch.recording)
      .filter(rec => rec === 'analyzed')
      .some(v => v);
  }

  render() {
    return (
      <div className="director-view">
        <div className="director-view-main-grid">
          <div className="grid-item grid-leftSide subgrid-left">
            <div className="grid-sub-item stage-view">
              <div className="bubble">
                <span>Current Slide</span>
                <h3>
                  {this.state.activeSlide
                    ? capitalize(this.state.activeSlide)
                    : '...'}
                </h3>
              </div>
            </div>
            <ul className="grid-sub-item controls">
              <h3 className="all-slides-title">
                <Icon icon={['far', 'clone']} className="icon" />
                Slides
              </h3>
              {this.state.slides.map(slide => (
                <li
                  className={`${slugify(slide.name)}-select control ${
                    slide.child ? 'select-child' : null
                  }`}
                  key={slide.name}
                >
                  <label className="control-radio">
                    <input
                      type="radio"
                      value={slide.name}
                      checked={this.state.activeSlide === slide.name}
                      onChange={this.handleSlideClick(slide.name)}
                    />
                    <i />
                    <span className="stage-name">{capitalize(slide.name)}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid-item grid-rightSide main subgrid-right">
            <ul className="grid-sub-item connected-list">
              {this.state.channels.map(channel => (
                <li
                  key={channel.id}
                  style={{
                    background: this.getChannelHighlight(channel).highlight
                      .backgroundColor
                  }}
                >
                  <div className="channel-control">
                    <label>
                      <input
                        type="checkbox"
                        checked={this.state.appointedChannels.includes(
                          channel.id
                        )}
                        onChange={this.handleChannelClick(channel.id)}
                      />
                    </label>
                    <span
                      className="channel-recording-state"
                      style={{
                        color: this.getChannelHighlight(channel).label.color,
                        background: this.getChannelHighlight(channel).label
                          .backgroundColor
                      }}
                    >
                      {channel.recording ? channel.recording : 'idle'}
                    </span>
                  </div>
                  <span className="channel-id">{channel.id}</span>
                </li>
              ))}
              <div className="analyzer-controls-container">
                <div className="analyzer-controls">
                  <button
                    disabled={!this.someChannelAnalyzed}
                    onClick={this.handleFinalizeTonesClick}
                  >
                    Finalize Tones
                  </button>
                </div>
              </div>
            </ul>
            <div className="grid-sub-item markdown-container">
              <DocumentPanel input={this.state.markdownDoc} />
            </div>
            <div className="top-words">
              <h2>Top words</h2>
              {this.state.topWords.length <= 0 ? (
                <p>Press Finalize Tones for top words!</p>
              ) : (
                <ol>
                  {_.map(this.state.topWords, (tw, id) => (
                    <li key={id}>{tw}</li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
