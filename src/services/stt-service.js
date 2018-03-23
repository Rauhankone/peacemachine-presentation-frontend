import Axios from 'axios';
import watsonSpeech from 'watson-speech';

const axios = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_HOST}:${
    process.env.REACT_APP_SERVER_PORT
  }`
});

export const useMediaStream = mediaStream => {
  return new Promise(async (resolve, reject) => {
    if (!mediaStream) return reject(new Error('No mediaStream provided!'));
    console.log('mo');
    try {
      const { data: { token } } = await axios.get('/token');
      console.log(token);
      resolve(
        watsonSpeech.SpeechToText.recognizeMicrophone({
          token,
          mediaStream,
          extractResults: true
        })
      );
    } catch (error) {
      reject(error);
    }
  });
};

export const outputFinal = data => {
  if (data.final) {
    return {
      confidence: data.alternatives[0].confidence,
      transcript: data.alternatives[0].transcript
    };
  }
};
