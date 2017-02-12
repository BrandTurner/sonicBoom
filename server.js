/* Load the HTTP library */
var http = require("http");
var express = require('express');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
const spawn = require('child_process').spawn;
const ffmpeg = require('fluent-ffmpeg');
var moment = require('moment');
const request = require('request');

const Spotify = require('spotify-web-api-node');
const CLIENT_ID = 'a524fb6de5bb4ae0b86d19e9411ddbdc';
const CLIENT_SECRET = '1acd7cc0474e42e794ec2ad470a0d758';
const REDIRECT_URI = 'http://localhost:5000/callback';
const STATE_KEY = 'spotify_auth_state';

const scopes = ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private'];

// configure spotify
const spotifyApi = new Spotify({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI
});

/** Generates a random string containing numbers and letters of N characters */
const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);

//TODO - Playlist download strategy
// https://www.libhive.com/providers/npm/packages/ytdl-core

/* Create an HTTP server to handle responses */
var app = express();

// CORS SHIT
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// TODO - get stuff after download, should be title plus the youtube ID
// TODO - for caching purposes, once new item is downloaded, register in DB
// using spotify as id of record
//https://localhost:5000/download/:videoId?playlist=false
const outputPath = __dirname + '/download/';

app.get('/kcrw', function(req, res) {
    request('https://tracklist-api.kcrw.com/Simulcast/date/' + moment().subtract(2, 'days').format("YYYY/MM/DD"), function (error, response, body){
        if (!error && response.statusCode == 200) {
            res.send(JSON.parse(body));
            console.log(body);
        }
    });
});

//TODO create cfg file with paths set there

app.get('/api/download/:videoId', function(request, response) {

    const isPlaylist = request.query.playlist || '';
    const title = request.query.title || '';
    const youtubeLink = 'https://youtube.com/watch?v=' + request.params.videoId;
    const audioOutput = outputPath + title;

    var url = youtubeLink;
    var output = audioOutput;


    var video = ytdl(url, {filter: 'audioonly'});
    console.log(video);
    video.pipe(fs.createWriteStream(output));
    video.on('response', function(res) {
      var totalSize = res.headers['content-length'];
      var dataRead = 0;

      res.on('data', function(data) {
        dataRead += data.length;
        var percent = dataRead / totalSize;
        process.stdout.cursorTo(0);
        process.stdout.clearLine(1);
        process.stdout.write((percent * 100).toFixed(2) + '% ');
      });
      res.on('end', function() {
        process.stdout.write('\n');
        response.writeHead(204);

        response.end();
      });
    });

//TODO Figure out best method to download...generate url for d/l???

/*
    var url = youtubeLink;
    var videoUrl = url;
    var destDir = audioOutput;

    var videoReadableStream = ytdl(videoUrl, {filter: 'audioonly'});
    ytdl.getInfo(videoUrl, function(err, info) {

        destDir = destDir + '.' +  info.container;
        var videoName = info.title.replace('|', '').toString('ascii');
        var videoWritableStream = fs.createWriteStream(destDir);
        var stream = videoReadableStream.pipe(videoWritableStream);

        // Do I need to close the file?
        stream.on('finish', function() {

            response.writeHead(204);

            response.end();
        })



    })
    */

/*ytdl(url, { filter: function(f) {
  return f.container === 'mp4' && !f.encoding ; } })
  // get audio bitrate 160 || 128
  // Write audio to file since ffmpeg supports only one input stream.
  .on('error',  (error) => {
    // TODO: return next(error) - https://github.com/fent/node-ytdl-core/issues/40
    console.log('Error : ', error);
    response.send('We could not find a video to download', 404);
  })
  .pipe(fs.createWriteStream(audioOutput))
  .on('finish', function() {
    ffmpeg()
      .noVideo()
      .input(audioOutput)
      .audioCodec('libmp3lame')
      .save(path.resolve(__dirname, 'outputnew.mp4'))
      .on('error', console.error)
      .on('progress', function(progress) {
        process.stdout.cursorTo(0);
        process.stdout.clearLine(1);
        process.stdout.write(progress.timemark);
      }).on('end', function() {
        console.log('done');
        response.download(path.resolve(__dirname, 'outputnew.mp4'))
      });
  });*/
});

/**
 * The /login endpoint
 * Redirect the client to the spotify authorize url, but first set that user's
 * state in the cookie.
 */
app.get('/login', (_, res) => {
  const state = generateRandomString(16);
  res.cookie(STATE_KEY, state);
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});

/**
 * The /callback endpoint - hit after the user logs in to spotifyApi
 * Verify that the state we put in the cookie matches the state in the query
 * parameter. Then, if all is good, redirect the user to the user page. If all
 * is not good, redirect the user to an error page
 */
app.get('/callback', (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
  // first do state validation
  //if (state === null || state !== storedState) {
    //res.redirect('/#/error/state mismatch');
  // if the state is valid, get the authorization code and pass it on to the client
  //} else {
    res.clearCookie(STATE_KEY);
    // Retrieve an access token and a refresh token
    spotifyApi.authorizationCodeGrant(code).then(data => {
        const { expires_in, access_token, refresh_token } = data.body;

      // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

      // use the access token to access the Spotify Web API






      // we can also pass the token to the browser to make requests from there
      res.redirect(`http://localhost:3000/#/user/${access_token}/${refresh_token}`);

    }).catch(err => {
        //TODO create error route
      res.send('/#/error/invalid token');
    });
 // }
});

app.listen(5000);
