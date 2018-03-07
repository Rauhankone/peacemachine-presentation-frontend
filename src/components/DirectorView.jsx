import React from 'react';

import { slugify, capitalize } from '../utils';

import socketService from '../services/socket-service';
import '../styles/DirectorView.css';
import Icon from '@fortawesome/react-fontawesome';

export default class DirectorView extends React.Component {
  constructor(props) {
    super(props);
    socketService.initSocket('director');

    this.directorSocket();
  }

  state = {
    channels: [],
    slides: [],
    activeSlide: null,
    appointedChannels: [],
    maxCandidateChannels: 3
  };

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
      console.log('channelRecordingChange');
      this.setState(prevState => {
        const i = prevState.channels.findIndex(el => el.id === data.id);

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

  handleChannelClick = channel => event => {
    console.log(this.state.appointedChannels);
    socketService.emitEvent('channelCandidacyChanged', {
      id: channel,
      candidate: !this.state.appointedChannels.includes(channel)
    });
  };

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
                  className={`${slugify(slide.name)}-select control`}
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
                    background: this.state.appointedChannels.includes(
                      channel.id
                    )
                      ? 'rgba(59, 153, 252, .15)'
                      : null
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
                        color: channel.recording ? '#3897FC' : '#dadada'
                      }}
                    >
                      {channel.recording ? 'recording' : 'idle'}
                    </span>
                  </div>
                  <span className="channel-id">{channel.id}</span>
                </li>
              ))}
            </ul>
            <div className="grid-sub-item zoom-tool" />
          </div>
        </div>
      </div>
    );
  }
}
