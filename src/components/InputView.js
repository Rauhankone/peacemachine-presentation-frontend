import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import sttService, { outputFinal } from '../services/stt-service';

export default class InputView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      stream: null,
      sttResult: 'It\'s a start... '
    }
  }

  componentWillMount = () => {

  }

  handleClick = () => {
    let stream;
    if (this.state.isRecording && this.state.stream) {
      this.state.stream.stop();
      this.setState({
        isRecording: false,
        stream: null
      });
    } else {
      sttService('.live-text')
        .then((res) => {
          stream = res;
          stream.on('data', (data) => {
            this.handleStreamInput(outputFinal(data));
          });
        })
        .then((res) => {
          this.setState(prevState => ({
            isRecording: true,
            stream
          }));
        });
    }
  }

  handleStreamInput = (data) => {
    if (data) {
      this.setState(prevState => ({
        sttResult: prevState.sttResult + data.transcript
      }));
    }
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