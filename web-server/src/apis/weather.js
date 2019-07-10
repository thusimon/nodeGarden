const getGeoLocation = require('../utils/getGeoLocation');
const getWeather = require('../utils/getWeather');

const weatherAPI = (req, res) => {
  if (req.query.address) {
    const address = req.query.address;
    let location;
    getGeoLocation(address)
      .then(loc => {
        location = loc;
        return getWeather(location.latitude, location.longtitude)
      })
      .then(weather => {
        return res.send({
          weather,
          location,
          address
        });
      })
      .catch(err => {
        return res.send({err});
      });
  } else {
    return res.send({
      err: 'Please send correct address parameter'
    })
  }
}

module.exports = weatherAPI;