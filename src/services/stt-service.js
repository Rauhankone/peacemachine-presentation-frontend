// import {} from 'dotenv';
import Axios from 'axios';
import watsonSpeech from 'watson-speech';

console.log(process.cwd());
console.log(process.env.SERVER_HOST);

// const axios = Axios.create({ baseURL: `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}` });
const axios = Axios.create({baseURL: 'http://localhost:8080'});
let token = '';

export default (outputElement) => {
  axios.get('/token')
    .then((res) => {
      console.log(res.data.token);
      token = res.data.token;
      let stt = watsonSpeech.SpeechToText
        .recognizeMicrophone(
          { token,
            outputElement
          }
        );
      stt.on('data', (data) => {
        console.log(data);
      })
      return stt;
    }).catch(console.log);
}