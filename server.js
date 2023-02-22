'use strict';

//import the express framework
const express = require('express');
//import cors
const cors = require('cors');

const server = express();
//server open for all clients requests
server.use(cors());

const PORT = 5500;

const fs = require('fs');



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

//Routes

//home route
server.get('/', (req, res) => {
    let data = fs.readFileSync('Movie_Data/data.json');
    let jsonData = JSON.parse(data);

    let Obj = JSON.stringify({
        title: jsonData.title,
        poster_path: jsonData.poster_path,
        overview: jsonData.overview
    });
    res.send(Obj);
})

//favorite route
server.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
})

// 404 errors
server.use(function (req, res, next) {
    let jsonObj = JSON.stringify({ status: 404, responseText: 'Sorry, page not found' });
    res.status(404).send(jsonObj);
});

// server errors
server.use(function (err, req, res, next) {
    let jsonObj = JSON.stringify({ status: 500, responseText: 'Sorry, something went wrong' });
    res.status(500).send(jsonObj);
});

//default route
// server.get('*', (req, res) => {

// })

// http://localhost:5500 => (Ip = localhost) (port = 5500)
server.listen(PORT, () => {
    console.log(`listening on ${PORT} : I am ready`);
})