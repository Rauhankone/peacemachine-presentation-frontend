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
    slides: [
      'live text',
      'sentiment analysis',
      'word cloud',
      'zoom tool',
      'loop'
    ],
    activeSlide: 'live text',
    appointedChannels: []
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
  };

  // TODO: Create dem handlers
  // handleLoopClick = e => {};
  // handeLiveTextClic = e => {};
  // handleSentimentClick = e => {};
  // handleWordCloudClick = e => {};
  // handleZoomToolClick = e => {};

  handleControlClick = slide => event => {
    this.setState({ activeSlide: slide });

    socketService.emitEvent('changeSlide', { slideName: slide });
  };

  handleChannelClick = channel => event => {
    this.setState(({ appointedChannels }) => {
      return !appointedChannels.includes(channel)
        ? {
            appointedChannels: [...appointedChannels, channel]
          }
        : {
            appointedChannels: [...appointedChannels.filter(c => c !== channel)]
          };
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
                <h3>{capitalize(this.state.activeSlide)}</h3>
              </div>
            </div>
            <ul className="grid-sub-item controls">
              <h3 className="all-slides-title">
                <Icon icon={['far', 'clone']} className="icon" />
                Slides
              </h3>
              {this.state.slides.map(slide => (
                <li className={`${slugify(slide)}-select control`} key={slide}>
                  <label className="control-radio">
                    <input
                      type="radio"
                      value={slide}
                      checked={this.state.activeSlide === slide}
                      onChange={this.handleControlClick(slide)}
                    />
                    <i />
                    <span className="stage-name">{capitalize(slide)}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid-item grid-rightSide main subgrid-right">
            <ul className="grid-sub-item connected-list">
              {this.state.channels.map(channel => (
                <li key={channel.id}>
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
