import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export default class RecordingButton extends React.Component {
  recordingStateContext = recordingState => {
    switch (recordingState) {
      case 'loading':
        break;
      case 'appointed':
        return 'Select Audio Source';
      case 'ready':
        return 'Start Recording';
      case 'recording':
        return 'Stop Recording';
      case 'finished':
      case 'analyzed':
        return 'All Done!';
      default:
        return 'Waiting for Director';
    }
  };

  render() {
    const { disabled, recordingState } = this.props.conditions;

    return (
      <button
        style={{
          backgroundColor: disabled ? '#FAFAFA' : '#3F5365',
          color: disabled ? '#3F5365' : '#FAFAFA',
          minWidth: '150px',
          height: '35px',
          pointerEvents: disabled ? 'none' : 'initial',
          fontSize:
            recordingState === 'ready' || recordingState === 'recording'
              ? '1rem'
              : '0.8rem'
        }}
        onClick={this.props.onButtonClick}
      >
        <span>
          {this.recordingStateContext(recordingState) ? (
            this.recordingStateContext(recordingState)
          ) : (
            <FontAwesomeIcon icon={['far', 'spinner-third']} spin />
          )}
        </span>
      </button>
    );
  }
}
