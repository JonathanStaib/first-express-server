'use strict';

console.log('Yaaasssss');

const { response } = require('express');
// *** REQUIRES ***
const express = require('express');
require('dotenv').config();
let data = require('./data/pets.json');

console.log('another one');
//  once express is in we need to use it - per express docs
//  app === server
const app = express();


//  define my port
const PORT = process.env.PORT || 3002;
// 3002- if my server is up on 3002, then i know there is something wrong with my .env file or i didnt bring in dotenv library. Or something else is running on that port...

//  *** ENDPOINTS ***

//  Base endpoint

app.get('/', (request, response)=> {
  console.log('This is showing up in terminal');
  response.status(200).send('Welcome to my server');
});

app.get('/hello', (request, response)=> {
  console.log(request.query);
  let firstName = request.query.firstName;
  let lastName = request.query.lastName;
  response.status(200).send(`Hello ${firstName} ${lastName}! Welcome to my server`);
});

app.get('/pet', (request, reponse, next)=>{
  try{
    let species = request.query.species;
    let dataToGroom = data.find(pet => pet.species === species);
    let dataToSend = new Pet(dataToGroom);
    // console.log(species);
    response.status(200).send(dataToSend);
  } catch(error){
    next(error);
  }
});

class Pet {
  constructor(petObj){
    this.name = petObj.name;
    this.breed = petObj.breed;
  }
}

//  catch all and should live at the bottom
app.get('*',(request, response)=> {
  response.status(404).send('This route does not exist');
});
// *** ERROR HANDLING ***
app.use((error, request, reponse, next)=>{
  response.status(500).send(error.message);
});

// *** SERVER START ***
app.listen(PORT, ()=> console.log(`We are up and running on port ${PORT}`));
