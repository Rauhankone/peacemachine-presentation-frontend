// import {} from 'dotenv';
import Axios from 'axios';
import watsonSpeech from 'watson-speech';
import path from 'path';

console.log(__dirname);

// TODO: use process.env for SERVER_HOST and SERVER_PORT, but somehow process.env isn't loading properly
// const axios = Axios.create({ baseURL: `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}` });
const axios = Axios.create({ baseURL: 'http://localhost:8080' });
let token = '';

export default (recFile) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Request timed out');
    }, 5000);
    axios.get('/token')
      .then((res) => {
        token = res.data.token;
        let stt = watsonSpeech.SpeechToText
          .recognizeMicrophone(
            {
              token,
              extractResults: true
            }
          );
        stt.on('data', (data) => {
          console.log(data);
        })
        resolve(stt);
      }).catch((e) => {
        reject('Unabled to aquire token for Watson speech-to-text service (invalid credentials, maybe?)');
        console.log(e);
      });
  });
};

export const outputFinal = (data) => {
  if (data.final) {
    return {
      confidence: data.alternatives[0].confidence,
      transcript: data.alternatives[0].transcript
    };
  }
};