import React from 'react';

import AnalyzedToneTooltip from './AnalyzedToneTooltip';
import '../styles/InputView.css';

import socketService from '../services/socket-service';
import sttService, { outputFinal } from '../services/stt-service';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { generateFakeChannelData } from '../utils';

export default class InputView extends React.Component {
  constructor(props) {
    super(props);
    this.fullTranscript = '';
    this.state = {
      isRecording: false,
      stream: null,
      sttResultArr: [],
      channel: {},
      candidate: false,
      analyzedSentences: [],
      hoveringOnSentence: false,
      activeSentenceIndex: null
    };
    this.inputSocket();
  }

  inputSocket = () => {
    console.log(socketService.initSocket);
    socketService.initSocket('input');

    socketService.emitEvent('channelCreated');

    socketService.subscribeToEvent('initStoreProps', ({ id }) => {
      this.setState({ channel: { id } });
    });

    socketService.subscribeToEvent('channelUpdated', data => {
      console.log('channelUpdated');
      //console.log(data);
    });

    socketService.subscribeToEvent('channelCandidacyUpdated', data => {
      if (data.id === this.state.channel.id) {
        this.setState({ candidate: data.candidate });
      }
    });

    socketService.subscribeToEvent('toneAnalyzeComplete', data => {
      console.log(data);
      this.setState({ analyzedSentences: data.analyzeObject.sentences_tone });
      console.log(this.state.analyzedSentences);
    });
  };

  handleClick = () => {
    let stream;
    if (this.state.isRecording && this.state.stream) {
      this.state.stream.stop();

      socketService.emitEvent('channelRecordingState', { recording: false });

      this.setState({
        isRecording: false,
        stream: null
      });
    } else {
      sttService('.live-text')
        .then(res => {
          socketService.emitEvent('channelRecordingState', { recording: true });
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

  handleSentenceMouseHover = e => {
    let i = Number.parseInt(e.target.getAttribute('index'));
    this.toggleSentenceHoverState(i);
  };

  toggleSentenceHoverState = index => {
    this.setState(prevState => ({
      hoveringOnSentence: !prevState.hoveringOnSentence,
      activeSentenceIndex: !prevState.hoveringOnSentence ? index : null
    }));
  };

  genFakeChannelDataStream = e => {
    let INTERVAL_ID = null;
    let i = 0;
    const fakeDataArray = generateFakeChannelData(24);

    INTERVAL_ID = setInterval(() => {
      this.handleStreamInput(fakeDataArray[i]);
      i++;
      if (i >= fakeDataArray.length - 1) {
        socketService.emitEvent('channelRecordingState', { recording: false });
        clearInterval(INTERVAL_ID);
      }
    }, 50);
  };

  render() {
    return (
      <div className="input-view">
        <div className="input-view-content">
          <div className="voice-controls">
            <FontAwesomeIcon
              icon={['far', 'microphone']}
              className="rec-icon"
              size="lg"
              style={{ color: this.state.isRecording ? '#ee5253' : '#DADADA' }}
            />
            <div className="channel-id">
              <h3>Channel ID</h3>
              <span>{this.state.channel.id}</span>
            </div>
            {this.state.candidate ? (
              <button
                className={
                  'recordBtn ' + (this.state.isRecording ? 'isRecording' : '')
                }
                onClick={this.handleClick}
              >
                {this.state.isRecording
                  ? 'Stop Speech Transcription'
                  : 'Start Speech Transcription'}
              </button>
            ) : (
                <span className="not-candidate">Start Speech Transcription</span>
              )}
            <button
              onClick={this.genFakeChannelDataStream}
              style={{ marginLeft: '0.5rem', padding: '.3rem 1rem' }}
            >
              fake
            </button>
          </div>
          <div className="live-text-container">
            {this.state.isRecording && (
              <div className="recording-info">
                <FontAwesomeIcon
                  icon={['far', 'info-circle']}
                  size="lg"
                  style={{ margin: '0 1rem 0 .5rem' }}
                />
                <span>
                  Watson is now transcribing your speech from the selected audio
                  source
                </span>
              </div>
            )}
            <p className="live-text">
              {this.state.sttResultArr.map((resultObj, i) => {
                let styleObj = {
                  color: `rgba(0, 0, 0, ${resultObj.confidence})`
                };
                return (
                  <span
                    style={styleObj}
                    className="live-text-sentence"
                    key={i}
                    index={i}
                    onMouseEnter={this.handleSentenceMouseHover}
                    onMouseLeave={this.handleSentenceMouseHover}
                  >
                    {resultObj.transcript}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
        {/* Analyzed sentence tooltip */}
        {this.state.analyzedSentences[this.state.activeSentenceIndex] &&
          <AnalyzedToneTooltip
            analyzeObj={this.state.analyzedSentences[this.state.activeSentenceIndex]} />}
      </div>
    );
  }
}
