import React from 'react';

import { slugify, capitalize } from '../utils';

import socketService from '../services/socket-service';
import '../styles/DirectorView.css';

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
    activeSlide: 'live text'
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

  render() {
    return (
      <div className="director-view">
        <div className="director-view-main-grid">
          <div className="grid-item grid-leftSide subgrid-left">
            <div className="grid-sub-item stage-view">
              <p>Current slide is:</p>
              <h3>{capitalize(this.state.activeSlide)}</h3>
            </div>
            <ul className="grid-sub-item controls">
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
          <div className="grid-item grid-rightSide subgrid-right">
            <div className="grid-sub-item connected-list">
              {this.state.channels.map(ch => <p key={ch.id}>{ch.id}</p>)}
            </div>
            <div className="grid-sub-item zoom-tool" />
          </div>
        </div>
      </div>
    );
  }
}
