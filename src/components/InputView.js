import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import socket from '../socket.config.js';
import sttService, { outputFinal } from '../services/stt-service';

export default class InputView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      stream: null,
      sttResultArr: []
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
        }).catch((err) => console.log(err));
    }
  }

  handleStreamInput = (data) => {
    if (data) {
      this.setState(prevState => ({
        sttResultArr: prevState.sttResultArr.concat(data)
      }));
      socket.emit('bar', data);
      console.log(this.state.sttResultArr);
    }
  }

  render() {
    return (
      <div className="input-view">
        <div className="voice-controls">
          <button className={"recordBtn " + (this.state.isRecording ? 'isRecording' : '')} onClick={this.handleClick}>
            {this.state.isRecording ? 'Stop speech transcription' : 'Start speech transcription'}
          </button>
        </div>
        <div className="recording-info-container">
          <p>{this.state.isRecording ? 'Watson is now transcribing your speech, try using your microphone' : ''}</p>
        </div>
        <div className="live-text-container">
          <p className="live-text">{this.state.sttResultArr.map((resultObj, i) => {
            let styleObj = { color: `rgba(0, 0, 0, ${resultObj.confidence})` };
            return <span style={styleObj} key={i}>{resultObj.transcript}</span>;
          })}</p>
        </div>
      </div>
    )
  }

};