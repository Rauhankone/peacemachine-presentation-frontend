import React from 'react';

import { initSocket } from '../socket.config';
import sttService, { outputFinal } from '../services/stt-service';

export default class InputView extends React.Component {
  constructor(props) {
    super(props);
    this.fullTranscript = '';
    this.state = {
      isRecording: false,
      stream: null,
      sttResultArr: []
    };
    this.socket = initSocket('input');
    if (this.socket) {
      this.socket.emit('connected', { viewName: 'input' }); // View identification on server
      this.socket.on('channelUpdated', data => {
        console.log('channelUpdated: ');
        console.log(data);
      });
    }
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
        .then(res => {
          this.socket.emit('recording', { recording: true });
          stream = res;
          stream.on('data', data => {
            this.handleStreamInput(outputFinal(data));
          });
        })
        .then(res => {
          this.setState(prevState => ({
            isRecording: true,
            stream
          }));
        })
        .catch(err => console.log(err));
    }
  };

  handleStreamInput = data => {
    if (data) {
      this.fullTranscript += data.transcript;
      this.setState(prevState => ({
        sttResultArr: prevState.sttResultArr.concat(data)
      }));
      if (this.socket) {
        this.socket.emit('channelData', {
          ...data,
          fullTranscript: this.fullTranscript
        });
      } else {
        console.log('Socket connection not available!');
      }
      console.log(this.state.sttResultArr);
    }
  };

  render() {
    return (
      <div className="input-view">
        <div className="voice-controls">
          <button
            className={
              'recordBtn ' + (this.state.isRecording ? 'isRecording' : '')
            }
            onClick={this.handleClick}
          >
            {this.state.isRecording
              ? 'Stop speech transcription'
              : 'Start speech transcription'}
          </button>
        </div>
        <div className="recording-info-container">
          <p>
            {this.state.isRecording
              ? 'Watson is now transcribing your speech, try using your microphone'
              : ''}
          </p>
        </div>
        <div className="live-text-container">
          <p className="live-text">
            {this.state.sttResultArr.map((resultObj, i) => {
              let styleObj = {
                color: `rgba(0, 0, 0, ${resultObj.confidence})`
              };
              return (
                <span style={styleObj} key={i}>
                  {resultObj.transcript}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    );
  }
}
