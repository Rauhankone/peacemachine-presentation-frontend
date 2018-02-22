import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import sttService from '../services/stt-service';

export default class InputView extends React.Component {

  constructor(props) {
    super();
    this.state = {
      isRecording: false,
      stream: null,
      sttResult: 'It\'s a start... '
    }
  }

  componentWillMount = () => {
    let stream = sttService('.live-text');
  }

  handleClick = () => {
    this.setState(prevState => ({
      isRecording: !prevState.isRecording
    }));
  }

  render() {
    return (
      <div className="input-view">
        <div className="voice-controls">
          <button onClick={this.handleClick}>
            {this.state.isRecording ? 'Stop speech transcription' : 'Start speech transcription'}
          </button>
        </div>
        <div className="live-text-container">
          <p className="live-text">{this.state.sttResult}</p>
        </div>
      </div>
    )
  }

};