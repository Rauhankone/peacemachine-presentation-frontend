import Axios from 'axios';

export default Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_HOST}:${
    process.env.REACT_APP_SERVER_PORT
  }`
});
