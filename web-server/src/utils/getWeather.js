const axios = require('axios');

const weatherKey = '8b68863bc1f9852e35ef41f76c760f97';

const weatherRequest = async (weatherUrl) => {
  try {
    const response = await axios.get(weatherUrl, {
      method:'get',
      responseType:'json',
      responseEncoding: 'utf8'
    });
    return Promise.resolve(response.data);
  } catch (err) {
    return Promise.reject('request error: ' + err);
  }
}

const getWeather = (latitude, longtitude) => {
  const weatherUrl = `https://api.darksky.net/forecast/${weatherKey}/${latitude},${longtitude}?units=si`;
  return weatherRequest(weatherUrl)
    .then(({error, currently, daily:dailyData}) => {
    if(error) {
      return Promise.reject(error);
    } else {
      const daily = dailyData.data;
      return Promise.resolve({
        currently,
        daily
      })
    }
  }).catch(err => {
    return Promise.reject(err);
  })
}

module.exports = getWeather;
