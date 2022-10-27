'use strict';

console.log('Yaaasssss');

// *** REQUIRES ***
const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json');
const cors = require('cors');
// console.log(data[0].data[0].datetime);

//  once express is in we need to use it - per express docs
//  app === server
const app = express();

// Middleware to share resources across internet CORS ('CDE') to remember
app.use(cors());

//  define my port
const PORT = process.env.PORT || 3002;
// 3002- if my server is up on 3002, then i know there is something wrong with my .env file or i didnt bring in dotenv library. Or something else is running on that port...

//  *** ENDPOINTS ***

//  Base endpoint

app.get('/', (request, response)=> {
  console.log('This is showing up in terminal');
  response.status(200).send('Welcome to my server');
});

app.get('/key', (request, response, next)=>{
  // response.contentType('application/json');
  // next();
  let cityName = request.query.cityName;
  // let lat = request.query.lat;
  // let lon = request.query.lon;
  try{
    // console.log(lat);
    // console.log(lon);
    let dataToWeather = data.find(climate => {
      return climate.city_name === cityName;
    });
    console.log(dataToWeather);

    let dataToSend = dataToWeather.data.map(day=> new Forcast(day));
    console.log(dataToSend);
    response.status(200).send(dataToSend);
  } catch(error){
    next(error);
  }
});

class Forcast {
  constructor(day){
    this.date = day.datetime;
    this.description = day.weather.description;
  }
}

//  catch all and should live at the bottom
app.get('*',(request, response)=> {
  response.status(404).send('This route does not exist');
});
// *** ERROR HANDLING ***
app.use((error, request, response, next)=>{
  response.status(500).send(error.message);
});

// *** SERVER START ***
app.listen(PORT, ()=> console.log(`We are up and running on port ${PORT}`));
