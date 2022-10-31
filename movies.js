let axios = require ('axios');

async function getMovies(request, response, next){
  try{
    let cityName = request.query.city_name;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&query=${cityName}&language=en-US`;
    console.log(url);
    let movieInfo= await axios.get(url);
    // console.log(movieInfo.data);
    let dataToSend = movieInfo.data.results.map(film => new Movie(film));
    // console.log(dataToSend);
    response.status(200).send(dataToSend);

  } catch(error){
    next(error);
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

module.exports = getMovies;
