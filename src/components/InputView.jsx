import React from 'react';

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
      recording: null,
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
    });
  };

  handleRecClick = () => {
    let stream;
    let recState = [null, 'recording', 'finished'];

    switch (this.state.recording) {
      case null:
        sttService('.live-text').then(res => {
          socketService.emitEvent('channelRecordingState', {
            recording: recState[1]
          });

          stream = res;
          stream.on('data', data => {
            this.handleStreamInput(outputFinal(data));
          });

          this.setState(prevState => ({
            recording: recState[1],
            stream
          }));
        });
        break;
      case 'recording':
        this.state.stream.stop();

        socketService.emitEvent('channelRecordingState', {
          recording: recState[2]
        });

        this.setState({
          recording: recState[2]
        });
        break;
      case 'finished':
        sttService('.live-text').then(res => {
          socketService.emitEvent('channelRecordingState', {
            recording: recState[1]
          });

          stream = res;
          stream.on('data', data => {
            this.handleStreamInput(outputFinal(data));
          });

          this.setState(prevState => ({
            recording: recState[1]
          }));
        });
        break;
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
    if (this.state.analyzedSentences)
      console.log(this.state.analyzedSentences[i]);
  };

  toggleSentenceHoverState = index => {
    this.setState(prevState => ({
      hoveringOnSentence: !prevState.hoveringOnSentence,
      activeSentenceIndex: !prevState.hoveringOnSentence ? index : null
    }));
  };

  stringifyToneScore = score => {
    return score > 0.9
      ? 'very high'
      : score > 0.7
        ? 'high'
        : score > 0.4
          ? 'average'
          : score > 0.15
            ? 'low'
            : score > 0 ? 'very low' : score === 0 ? 'not available' : '';
  };

  buildAnalyzedSentenceToolTip = index => {
    if (!this.state.analyzedSentences || !this.state.analyzedSentences[index]) {
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
    };
    let subHeadings = {
      'font-weight': 'bold'
    };
    let subGroups = {
      padding: '10px'
    };

    return (
      <div style={styleObj}>
        <p style={subHeadings}>Emotion tone</p>
        <div style={subGroups}>
          <p>
            Anger: {this.stringifyToneScore(tone_categories[0].tones[0].score)}
          </p>
          <p>
            Disgust:{' '}
            {this.stringifyToneScore(tone_categories[0].tones[1].score)}
          </p>
          <p>
            Fear: {this.stringifyToneScore(tone_categories[0].tones[2].score)}
          </p>
          <p>
            Joy: {this.stringifyToneScore(tone_categories[0].tones[3].score)}
          </p>
          <p>
            Sadness:{' '}
            {this.stringifyToneScore(tone_categories[0].tones[4].score)}
          </p>
        </div>
        <p style={subHeadings}>Language tone</p>
        <div style={subGroups}>
          <p>
            Analytical:{' '}
            {this.stringifyToneScore(tone_categories[1].tones[0].score)}
          </p>
          <p>
            Confident:{' '}
            {this.stringifyToneScore(tone_categories[1].tones[1].score)}
          </p>
          <p>
            Tentative:{' '}
            {this.stringifyToneScore(tone_categories[1].tones[2].score)}
          </p>
        </div>
        <p style={subHeadings}>Social tone</p>
        <div style={subGroups}>
          <p>
            Openness:{' '}
            {this.stringifyToneScore(tone_categories[2].tones[0].score)}
          </p>
          <p>
            Conscientiousness:{' '}
            {this.stringifyToneScore(tone_categories[2].tones[1].score)}
          </p>
          <p>
            Extraversion:{' '}
            {this.stringifyToneScore(tone_categories[2].tones[2].score)}
          </p>
          <p>
            Agreeableness:{' '}
            {this.stringifyToneScore(tone_categories[2].tones[3].score)}
          </p>
          <p>
            Emotional range:{' '}
            {this.stringifyToneScore(tone_categories[2].tones[4].score)}
          </p>
        </div>
      </div>
    );
  };

  genFakeChannelDataStream = e => {
    let INTERVAL_ID = null;
    let i = 0;
    const fakeDataArray = generateFakeChannelData(10);

    INTERVAL_ID = setInterval(() => {
      this.handleStreamInput(fakeDataArray[i]);
      i++;
      if (i >= fakeDataArray.length - 1) {
        socketService.emitEvent('channelRecordingState', { recording: false });
        clearInterval(INTERVAL_ID);
      }
    }, 1000);
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
              style={{ color: this.state.recording ? '#ee5253' : '#DADADA' }}
            />
            <div className="channel-id">
              <h3>Channel ID</h3>
              <span>{this.state.channel.id}</span>
            </div>
            {this.state.candidate ? (
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
              onClick={this.genFakeChannelDataStream}
              style={{ marginLeft: '0.5rem', padding: '.3rem 1rem' }}
            >
              fake
            </button>
          </div>
          <div className="live-text-container">
            {this.state.recording && (
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
                    {this.state.activeSentenceIndex === i &&
                      this.buildAnalyzedSentenceToolTip(i)}
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
