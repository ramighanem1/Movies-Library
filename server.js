'use strict';

//import the express framework
const express = require('express');
//import cors
const cors = require('cors');

const server = express();

//server open for all clients requests
server.use(cors());

// by default we cant see the req.body content so we use this middleware function  
server.use(express.json());


const PORT = process.env.PORT || 5500;

// const fs = require('fs');
const Moviedata = require('./Movie_Data/data.json');

const axios = require('axios');
require('dotenv').config();

//Database - > importing the pg 
const pg = require('pg');

//2. create obj from Client
const client = new pg.Client(process.env.DATABASE_URL);


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


function Movie(title, posterPath, overview, id) {
    this.title = title;
    this.poster_path = posterPath;
    this.overview = overview;
    this.id = id;
}




//Routes

//home route
server.get('/', (req, res) => {
    let singleMovie = new Movie(Moviedata.title, Moviedata.poster_path, Moviedata.overview, Moviedata.id);
    res.send(singleMovie);
})

//favorite route
server.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
})

// search
server.get('/search', (req, res) => {
    try {
        const APIKey = process.env.APIKey;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`;
        axios.get(url)
            .then((result) => {
                let mapResult = result.data.results.map((movieData) => {
                    let singleMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview, movieData.id);
                    return singleMovie;
                })
                res.send(mapResult);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
})

//favorite route
server.get('/trending', (req, res) => {
    try {
        const APIKey = process.env.APIKey;
        const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`;
        axios.get(url)
            .then((result) => {
                let mapResult = result.data.results.map((movieData) => {
                    let singleMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview, movieData.id);
                    return singleMovie;
                })
                res.send(mapResult);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }

})



// now_playing
server.get('/now_playing', (req, res) => {
    try {

        const APIKey = process.env.APIKey;
        const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${APIKey}&language=en-US&page=1`;
        axios.get(url)
            .then((result) => {
                let mapResult = result.data.results.map((movieData) => {
                    let singleMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview, movieData.id);
                    return singleMovie;
                })
                res.send(mapResult);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }

})


// upcoming
server.get('/upcoming', (req, res) => {
    try {
        const APIKey = process.env.APIKey;
        const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKey}&language=en-US&page=1`;
        axios.get(url)
            .then((result) => {
                let mapResult = result.data.results.map((movieData) => {
                    let singleMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview, movieData.id);
                    return singleMovie;
                })
                res.send(mapResult);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }

})

//add Movie route
server.post('/addMovie', (req, res) => {
    const Movies = req.body;
    const sql = `INSERT INTO MovieInfo (title, posterPath, overview) VALUES ($1, $2, $3) RETURNING *;`
    const values = [Movies.title, Movies.poster_path, Movies.overview];

    client.query(sql, values)
        .then((data) => {
            res.send("your data was added !");
        })
        .catch(error => {
            // console.log(error);
            errorHandler(error, req, res);
        });
})

//get Movies route
server.get('/getMovies', (req, res) => {
    const sqlQuery = `SELECT * FROM MovieInfo`;
    client.query(sqlQuery)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
})



// UPDATE Movies
server.put('/UPDATE/:id', (req, res) => {
    const id = req.params.id;
    if (!isNaN(id)) {
        const Movies = req.body;
        const sql = `UPDATE MovieInfo SET title =$1 , posterPath =$2 , overview =$3 WHERE id = ${id} RETURNING *;`
        const values = [Movies.title, Movies.poster_path, Movies.overview];

        client.query(sql, values)
            .then((data) => {
                res.status(200).send(data.rows);
            })
            .catch(error => {
                // console.log(error);
                errorHandler(error, req, res);
            });
    }
    else {
        res.send("Id Must Be Numaric");
    }

})

//DELETE Movies
server.delete('/DELETE/:id', (req, res) => {
    const id = req.params.id;
    if (!isNaN(id)) {
        const sqlQuery = `DELETE FROM MovieInfo WHERE id = ${id};`;
        client.query(sqlQuery)
            .then((data) => {
                res.status(204).json({});
            })
            .catch((err) => {
                errorHandler(err, req, res);
            })
    }
    else {
        res.send("Id Must Be Numaric");
    }


})


//select Movies
server.get('/getMovie/:id', (req, res) => {
    const id = req.params.id;
    if (!isNaN(id)) {
        const sqlQuery = `SELECT * FROM MovieInfo WHERE id = ${id};`;
        client.query(sqlQuery)
            .then((data) => {
                res.send(data.rows);
            })
            .catch((err) => {
                errorHandler(err, req, res);
            })
    }
    else {
        res.send("Id Must Be Numaric");
    }





})


// 404 errors
server.get('*', (req, res) => {
    const errorObj = {
        status: 404,
        responseText: 'Sorry, page not found'
    }
    res.status(404).send(errorObj);
})




//middleware function
function errorHandler(err, req, res) {
    const errorObj = {
        status: 500,
        massage: err
    }
    res.status(500).send(errorObj);
}

// server errors
server.use(errorHandler)

//3. connect the server with movies database
// http://localhost:5500 => (Ip = localhost) (port = 5500)
client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on ${PORT} : I am ready`);
        });
    })