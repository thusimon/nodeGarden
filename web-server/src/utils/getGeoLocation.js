const axios = require('axios');
const mapToken = 'pk.eyJ1IjoidGh1c2ltb24iLCJhIjoiY2p3cmM4Nno5MWs4eTQ0bjNzYXJyMXJuMCJ9.h05P6AZJlEfkc4wVCBaGSg';

const locationRequest = async (reqUrl) => {
  try {
    response = await axios.get(reqUrl, {
      method:'get',
      responseType:'json',
      responseEncoding: 'utf8'
    })
    return Promise.resolve(response.data);
  } catch (err){
    return Promise.reject('request error: ' + err);
  }
}
const getLocation = (location) => {
  const reqUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapToken}&limit=1`;
  return locationRequest(reqUrl).then(({features}) => {
    if (features.length === 0){
      return Promise.reject('Wrong query, try another search');
    } else {
      const latitude = features[0].center[1];
      const longtitude = features[0].center[0];
      const name = features[0].place_name;
      return Promise.resolve({
        latitude,
        longtitude,
        name
      });
    }
  }).catch(err => {
    return Promise.reject(err);
  })
}

module.exports = getLocation;