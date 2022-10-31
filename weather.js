'use strict';
let axios = require('axios');

// async function getWeather(request, response, next){

// let cityName = request.query.cityName;


let cache = require('./cache.js');

module.exports = getWeather;

async function getWeather(request, response, lat, lon, next) {
  const key = 'weather?' + lat + lon;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
    response.status(200).send(cache[key].data);
  } else {
    console.log('Cache miss');

    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
      .then(response => parseWeather(response.data));
  }


  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
  }
}

// try{
//   let lat = request.query.lat;
//   let lon = request.query.lon;
//   let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
//   let weatherInfo = await axios.get(url);
// console.log(lat);
// console.log(lon);
// let dataToWeather = data.find(climate => {
//   return climate.city_name === cityName;
// });
// console.log(dataToWeather);
// console.log(weatherInfo);

//     let dataToSend = weatherInfo.data.data.map(day=> new Forcast(day));
//     console.log(dataToSend);
//     response.status(200).send(dataToSend);
//   } catch(error){
//     next(error);
//   }
// }

// class Forcast {
//   constructor(day){
//     this.date = day.datetime;
//     this.description = day.weather.description;
//   }
// }

// module.exports = getWeather;

