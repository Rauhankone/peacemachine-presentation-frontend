import Axios from 'axios';
import watsonSpeech from 'watson-speech';

const axios = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_HOST}:${
    process.env.REACT_APP_SERVER_PORT
  }`
});
let token = '';

export default recFile => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Request timed out');
    }, 5000);
    axios
      .get('/token')
      .then(res => {
        token = res.data.token;
        let stt = watsonSpeech.SpeechToText.recognizeMicrophone({
          token,
          extractResults: true
        });

        resolve(stt);
      })
      .catch(e => {
        reject(
          'Unable to aquire token for Watson speech-to-text service (invalid credentials, maybe?)'
        );
      });
  });
};

export const useMediaStream = mediaStream => {
  return new Promise(async (resolve, reject) => {
    if (!mediaStream) return reject(new Error('No mediaStream provided!'));

    try {
      const { data: { token } } = await axios.get('/token');

      resolve(
        watsonSpeech.SpeechToText.recognizeMicrophone({
          token,
          mediaStream,
          extractResults: true
        })
      );
    } catch (error) {
      console.log('something went wrong');
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
