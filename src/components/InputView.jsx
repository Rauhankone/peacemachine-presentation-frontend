import React from 'react';

import AnalyzedToneTooltip from './AnalyzedToneTooltip';
import '../styles/InputView.css';

import socketService from '../services/socket-service';
import sttService, {
  outputFinal,
  useMediaStream
} from '../services/stt-service';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { generateFakeChannelData } from '../utils';

export default class InputView extends React.Component {
  constructor(props) {
    super(props);
    this.fullTranscript = '';
    this.state = {
      recording: null,
      stream: null,
      sttResultArr: [],
      channel: {},
      candidate: false,
      analyzedSentences: [],
      hoveringOnSentence: false,
      activeSentenceIndex: null,
      canRecord: true,
      mediaStream: null
    };
    this.inputSocket();
    this.initUserMedia();
  }

  inputSocket = () => {
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
      this.setState({
        analyzedSentences: data.analyzeObject.sentences_tone
          ? data.analyzeObject.sentences_tone
          : [data.analyzeObject.document_tone]
      });
      console.log(this.state.analyzedSentences);
    });
  };

  initUserMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(mediaStream => {
        this.changeRecordingState('ready');
        this.setState({ mediaStream });
      })
      .catch(console.error);
  };

  handleRecClick = () => {
    let stream;
    let recState = [null, 'recording', 'finished'];

    switch (this.state.recording) {
      case null:
        useMediaStream(this.state.mediaStream).then(stream => {
          this.setState({ stream });
          this.changeRecordingState(recState[1]);

          stream.on('data', data => {
            this.handleStreamInput(outputFinal(data));
          });
        });
        break;
      // sttService('.live-text').then(res => {
      //   this.changeRecordingState(recState[1]);

      //   stream = res;
      //   stream.on('data', data => {
      //     this.handleStreamInput(outputFinal(data));
      //   });

      //   this.setState(prevState => ({
      //     stream
      //   }));
      // });
      // break;
      case 'recording':
        this.state.stream.stop();

        this.changeRecordingState(recState[2]);
        break;
      case 'finished':
        sttService('.live-text').then(res => {
          this.changeRecordingState(recState[1]);

          stream = res;
          stream.on('data', data => {
            this.handleStreamInput(outputFinal(data));
          });
        });
        break;
      default:
      // eslint wants default
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
    console.log(e);
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
    const fakeDataArray = generateFakeChannelData(16);

    INTERVAL_ID = setInterval(() => {
      this.handleStreamInput(fakeDataArray[i]);
      i++;
      if (i >= fakeDataArray.length - 1) {
        this.changeRecordingState('finished');
        clearInterval(INTERVAL_ID);
      }
    }, 100);
  };

  changeRecordingState = recording => {
    socketService.emitEvent('channelRecordingState', {
      recording
    });
    this.setState({ recording });
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
              style={{
                color:
                  this.state.recording === 'recording' ? '#ee5253' : '#DADADA'
              }}
            />
            <div className="channel-id">
              <h3>Channel ID</h3>
              <span>{this.state.channel.id}</span>
            </div>
            {this.state.candidate && this.state.recording !== 'finished' ? (
              <button
                className={
                  'recordBtn ' + (this.state.recording ? 'recording' : '')
                }
                onClick={this.handleRecClick}
              >
                {this.state.recording === 'recording'
                  ? 'Stop Speech Transcription'
                  : 'Start Speech Transcription'}
              </button>
            ) : (
              <span className="not-candidate">Start Speech Transcription</span>
            )}
            <button
              disabled={
                this.state.candidate && this.state.recording !== 'finished'
                  ? false
                  : true
              }
              onClick={this.genFakeChannelDataStream}
              style={{ marginLeft: '0.5rem', padding: '.3rem 1rem' }}
            >
              fake
            </button>
          </div>
          <div className="live-text-container">
            {this.state.recording === 'recording' && (
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
                    onMouseOut={this.handleSentenceMouseHover}
                  >
                    {resultObj.transcript}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
        {/* Analyzed sentence tooltip */}
        {this.state.analyzedSentences[this.state.activeSentenceIndex] && (
          <AnalyzedToneTooltip
            analyzeObj={
              this.state.analyzedSentences[this.state.activeSentenceIndex]
            }
          />
        )}
      </div>
    );
  }
}
