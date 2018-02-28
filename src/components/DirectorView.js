import React from 'react';
import { initSocket } from '../socket.config';

export default class DirectorView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: 'Sentiment analysis'
    }
  }

  componentWillMount() {
    this.socket = initSocket('input');
    if (this.socket) {
      this.socket.on('channelInitialized', data => {
        console.log(data);
      });
      this.socket.on('channelUpdated', data => {
        console.log('channelUpdated: ');
        console.log(data);
      });
    }
  }

  // TODO: Create dem handlers
  handleLoopClick = (e) => {
  }
  handeLiveTextClic = (e) => {
  }
  handleSentimentClick = (e) => {
  }
  handleWordCloudClick = (e) => {
  }
  handleZoomToolClick = (e) => { 
  }

  render() {
    return (
      <div className="director-view">
        <div className="director-view-main-grid">
          <div className="grid-item grid-header">
            <h1>Director View</h1>
          </div>
          <div className="grid-item grid-leftSide subgrid-left">
            <div className="grid-sub-item stage-view">
              <p>Current stage is:</p>
              <h3>{this.state.stage}</h3>
            </div>
            <div className="grid-sub-item loop-select btn" onClick={this.handleLoopClick}>Loop</div>
            <div className="grid-sub-item live-text-select btn" onClick={this.handleLiveTextClick}>Live Text</div>
            <div className="grid-sub-item sentiment-select btn" onClick={this.handleSentimentClick}>Sentiment</div>
            <div className="grid-sub-item word-cloud-select btn" onClick={this.handleWordCloudClick}>Word Cloud</div>
            <div className="grid-sub-item zoom-tool-select btn" onClick={this.handleZoomToolClick}>Zoom Tool</div>
          </div>
          <div className="grid-item grid-rightSide subgrid-right">
            <div className="grid-sub-item connected-list">
              <p>Connection 1</p>
              <p>Connection 2</p>
            </div>
            <div className="grid-sub-item zoom-tool"></div>
          </div>
        </div>
      </div>
    );
  }
}
