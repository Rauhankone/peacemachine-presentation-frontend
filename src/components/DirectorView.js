import React from 'react';
import socketService from '../services/socket-service';

export default class DirectorView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      channels: [],
      stage: 'Sentiment analysis'
    }
    socketService.initSocket('director');
    socketService.subscribeToEvent('channelInitialized', (data) => {
      this.setState(prevState => ({
        channels: prevState.channels.concat(data)
      }));
    });
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
              {this.state.channels.map((ch) => (
                <p key={ch.id}>{ch.id}</p>
              ))}
            </div>
            <div className="grid-sub-item zoom-tool"></div>
          </div>
        </div>
      </div>
    );
  }
}
