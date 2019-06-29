const getWeather = require('./utils/weather');
const geoLocation = require('./utils/geoLocation');
const yargs = require('yargs');
var locationName;

yargs.version('1.1.0');
const yargsConfig = {
  command: 'weather',
  describe: 'Get weather info',
  builder: {
    location: {
      describe: 'Location',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    weatherHandler(argv.location)
  }
};
yargs.command(yargsConfig);

const weatherHandler = (location) => {
  if(location){
    geoLocation(location).then(geoResult => {
      const latitude = geoResult.latitute;
      const longtitude = geoResult.longtitude;
      locationName = geoResult.name;
      return getWeather(latitude, longtitude);
    }).then(weatherData => {
      const cw = weatherData.currently;
      const daily = weatherData.daily;
      console.log(locationName);
      console.log(`${daily[0].summary} It is currently ${cw.temperature} out. There is ${(cw.precipProbability*100).toFixed(1)}% chance of rain`);
    }).catch(err => {
      console.log('Fail');
      console.log(err);
    });
  } else {
    console.log('Please input valid location');
  }
}

yargs.parse();