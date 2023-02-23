'use strict';

//import the express framework
const express = require('express');
//import cors
const cors = require('cors');

const server = express();

//server open for all clients requests
server.use(cors());

const PORT = 5500;

// const fs = require('fs');
const Moviedata = require('./Movie_Data/data.json');




// function Movie(title, genreIds, language, originalTitle, posterPath, video, voteAverage, overview, releaseDate, voteCount, id, adult, backdropPath, popularity, mediaType) {
//     this.title = title;
//     this.genre_ids = genreIds;
//     this.original_language = language;
//     this.original_title = originalTitle;
//     this.poster_path = posterPath;
//     this.video = video;
//     this.vote_average = voteAverage;
//     this.overview = overview;
//     this.release_date = releaseDate;
//     this.vote_count = voteCount;
//     this.id = id;
//     this.adult = adult;
//     this.backdrop_path = backdropPath;
//     this.popularity = popularity;
//     this.media_type = mediaType;
// }


function Movie(title, posterPath, overview) {
    this.title = title;
    this.poster_path = posterPath;
    this.overview = overview;
}

//Routes

//home route
server.get('/', (req, res) => {
    let singleMovie = new Movie(Moviedata.title, Moviedata.poster_path, Moviedata.overview);
    res.send(singleMovie);
})

//favorite route
server.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
})

// 404 errors
server.get('*', (req, res) => {
    const errorObj = {
        status: 404,
        responseText: 'Sorry, page not found'
    }
    res.status(404).send(errorObj);
})


// server errors
server.use(function (err, req, res) {
    const errorObj = {
        status: 500,
        responseText: 'Sorry, something went wrong'
    }
    res.status(500).send(errorObj);
});


// http://localhost:5500 => (Ip = localhost) (port = 5500)
server.listen(PORT, () => {
    console.log(`listening on ${PORT} : I am ready`);
})