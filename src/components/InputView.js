import React from 'react';

import '../styles/InputView.css';

import socketService from '../services/socket-service';
import sttService, { outputFinal } from '../services/stt-service';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export default class InputView extends React.Component {
  constructor(props) {
    super(props);
    this.fullTranscript = '';
    this.state = {
      isRecording: false,
      stream: null,
      sttResultArr: []
    };
    socketService.initSocket('input');
    socketService.emitEvent('channelCreated');
    socketService.subscribeToEvent('channelUpdated', data => {
      console.log('channelUpdated');
      console.log(data);
    });
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
          socketService.emitEvent('channelRecording');
          stream = res;
          stream.on('data', data => {
            this.handleStreamInput(outputFinal(data));
          });
          this.setState(prevState => ({
            isRecording: true,
            stream
          }));
          stream.on('message', event => console.log(event));
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
      socketService.emitEvent('channelData', {
        ...data,
        fullTranscript: this.fullTranscript
      });
    }
  };

  render() {
    return (
      <div className="input-view">
        <div className="input-view-content">
          <div className="voice-controls">
            <button
              className={
                'recordBtn ' + (this.state.isRecording ? 'isRecording' : '')
              }
              onClick={this.handleClick}
            >
              {!this.state.isRecording ? (
                <FontAwesomeIcon
                  icon={['far', 'microphone']}
                  className="rec-icon"
                />
              ) : null}
              {this.state.isRecording
                ? 'Stop Speech Transcription'
                : 'Start Speech Transcription'}
            </button>
          </div>
          <div className="live-text-container">
            {this.state.isRecording && (
              <div className="recording-info">
                Watson is now transcribing your speech from the selected audio
                source
              </div>
            )}
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
      </div>
    );
  }
}
