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
      console.log(data);
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
    })
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

  handleSentenceMouseHover = (e) => {
    let i = Number.parseInt(e.target.getAttribute('index'));
    this.toggleSentenceHoverState(i);
    if (this.state.analyzedSentences) console.log(this.state.analyzedSentences[i]);
  }

  toggleSentenceHoverState = (index) => {
    this.setState(prevState => ({
      hoveringOnSentence: !prevState.hoveringOnSentence,
      activeSentenceIndex: !prevState.hoveringOnSentence ? index : null
    }));
  }

  stringifyToneScore = (score) => {
    return score > 0.9 ? 'very high' :
           score > 0.7 ? 'high' :
           score > 0.4 ? 'average' :
           score > 0.15 ? 'low' :
           score > 0 ? 'very low' :
           score === 0 ? 'not available' : '';
  }

  buildAnalyzedSentenceToolTip = (index) => {
    if (!this.state.analyzedSentences ||  !this.state.analyzedSentences[index]) {
      return;
    }
    let tone_categories = this.state.analyzedSentences[index].tone_categories;

    let styleObj = {
      position: 'absolute',
      padding: '25px',
      background: '#333',
      color: '#ddf',
      top: '25px',
      left: '15px',
      'min-width': '400px',
      'z-index': 9999
    }
    let subHeadings = {
      'font-weight': 'bold'
    }
    let subGroups = {
      padding: '10px'
    }

    return (
      <div style={styleObj}>
        <p style={subHeadings}>Emotion tone</p>
        <div style={subGroups}>
          <p>Anger: {this.stringifyToneScore(tone_categories[0].tones[0].score)}</p>
          <p>Disgust: {this.stringifyToneScore(tone_categories[0].tones[1].score)}</p>
          <p>Fear: {this.stringifyToneScore(tone_categories[0].tones[2].score)}</p>
          <p>Joy: {this.stringifyToneScore(tone_categories[0].tones[3].score)}</p>
          <p>Sadness: {this.stringifyToneScore(tone_categories[0].tones[4].score)}</p>
        </div>
        <p style={subHeadings}>Language tone</p>
        <div style={subGroups}>
          <p>Analytical: {this.stringifyToneScore(tone_categories[1].tones[0].score)}</p>
          <p>Confident: {this.stringifyToneScore(tone_categories[1].tones[1].score)}</p>
          <p>Tentative: {this.stringifyToneScore(tone_categories[1].tones[2].score)}</p>
        </div>
        <p style={subHeadings}>Social tone</p>
        <div style={subGroups}>
          <p>Openness: {this.stringifyToneScore(tone_categories[2].tones[0].score)}</p>
          <p>Conscientiousness: {this.stringifyToneScore(tone_categories[2].tones[1].score)}</p>
          <p>Extraversion: {this.stringifyToneScore(tone_categories[2].tones[2].score)}</p>
          <p>Agreeableness: {this.stringifyToneScore(tone_categories[2].tones[3].score)}</p>
          <p>Emotional range: {this.stringifyToneScore(tone_categories[2].tones[4].score)}</p>
        </div>
      </div>
    )

  }

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
                    {console.log(i, JSON.stringify(this.state.activeSentenceIndex))}
                    {this.state.activeSentenceIndex === i &&
                      this.buildAnalyzedSentenceToolTip(i)
                    }
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
