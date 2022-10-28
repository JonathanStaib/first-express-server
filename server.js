'use strict';

console.log('Yaaasssss');

// *** REQUIRES ***
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require ('axios');


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

app.get('/movies', async(request, response, next)=>{
  try{
    let cityName = request.query.city_name;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&query=${cityName}&language=en-US`;
    console.log(url);
    let movieInfo= await axios.get(url);
    // console.log(movieInfo);
    let dataToSend = movieInfo.data.results.map(film => new Movie(film));
    // console.log(dataToSend);
    response.status(200).send(dataToSend);

  } catch(error){
    next(error);
  }
});

app.get('/weather', async(request, response, next)=>{

  // let cityName = request.query.cityName;
  try{
    let lat = request.query.lat;
    let lon = request.query.lon;
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
    let weatherInfo = await axios.get(url);
    // console.log(lat);
    // console.log(lon);
    // let dataToWeather = data.find(climate => {
    //   return climate.city_name === cityName;
    // });
    // console.log(dataToWeather);
    // console.log(weatherInfo);

    let dataToSend = weatherInfo.data.data.map(day=> new Forcast(day));
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

class Movie {
  constructor(film){
    this.title = film.title;
    this.img = film.poster_path;
    this.overview = film.overview;
    this.popularity = film.popularity;
    this.release_date = film.release_date;
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
