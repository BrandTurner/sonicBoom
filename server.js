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
    request('https://tracklist-api.kcrw.com/Simulcast/date/' + moment().subtract(1, 'days').format("YYYY/MM/DD"), function (error, response, body){
        if (!error && response.statusCode == 200) {
            res.send(JSON.parse(body));
            console.log(body);
        }
    });
});

app.get('/download/:videoId', function(request, response) {

    const isPlaylist = request.query.playlist || '';
    const title = request.query.title || '';
    const youtubeLink = 'https://youtube.com/watch?v=' + request.params.videoId;
    const audioOutput = outputPath + title + '.mp4';

    var url = youtubeLink;


ytdl(url, { filter: function(f) {
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
  });
});

app.listen(5000);
