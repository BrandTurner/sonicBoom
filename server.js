/* Load the HTTP library */
var http = require("http");
var express = require('express');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
const spawn = require('child_process').spawn;
const ffmpeg = require('fluent-ffmpeg');



/* Create an HTTP server to handle responses */
var app = express();
///var router = express.Router();
//Download request
// TODO - get stuff after download, should be title plus the youtube ID
// TODO - for caching purposes, once new item is downloaded, register in DB
// using spotify as id of record
//https://localhost:5000/download/:videoId?playlist=false
const outputPath = __dirname + '/download/';

app.get('/download/:videoId', function(request, response) {
    const isPlaylist = request.query.playlist;
    const title = request.query.title;
    const youtubeLink = 'https://youtube.com/watch?v=' + request.params.videoId;
    const audioOutput = outputPath + title + '.mp4';

    var stupidCallback = function (err, info) {
        console.log(info);
    }

    var url = youtubeLink;
    //ytdl.getInfo(url, {}, stupidCallback);
//var audioOutput = path.resolve(__dirname, 'sound.mp4');
ytdl(url, { filter: function(f) {
  return f.container === 'mp4' && !f.encoding ; } })
  // Write audio to file since ffmpeg supports only one input stream.
  .pipe(fs.createWriteStream(audioOutput))
  .on('finish', function() {
    ffmpeg()
    //.input(ytdl(url, { filter: function(f) {
    //  return f.container === 'mp4' && !f.audioEncoding; } }))
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

    const command = 'youtube-dl';
    const commandOptions = ['--extract-audio', '--audio-format',  'mp3', '--console-title',  '--newline', '--audio-quality', '4',  youtubeLink];
/*
    commandCombined = command + ' ' + commandOptions.join(' ');

    const downloadScript = spawn(command, commandOptions);


    downloadScript.stdout.on('data', (data) => {
        console.log(data.toString('utf8'));
    });


    downloadScript.stderr.on('data', (data) => {
        console.error('error');
    });

    downloadScript.on('exit', (code) => {
        console.log(code);
        response.download(audioOutput);
    });
*/
    // Usage
//scrapeLinks('http://yahoo.com').then((result) => {
  // result.code
  // result.uniqueLinks
//}, (result) => {
  // result.code
  // result.errors
//});

    //ytdl(youtubeLink, { filter: 'audioonly'})
    //.pipe(fs.createWriteStream(audioOutput));

    /*ytdl(youtubeLink, { filter: function(f) {
        return f.container === 'mp4' && !f.encoding;
    }})
    .pipe(fs.createWriteStream(audioOutput))
    .on('finish', function() {
        ffmpeg()
        .input(ytdl(youtubeLink, { filter: function(f) {
            return f.container === 'mp4' && !f.audioEncoding; }}
        ))
        .videoCodec('copy')
        .input(audioOutput)
        .audioCodec('copy')
        .save(outputPath + title + ' output.mp4')
        .on('error', console.error)
        .on('progress', function(progress) {
            process.stdout.cursorTo(0);
            process.stdout.clearLine(1);
            process.stdout.write(progress.timemark);
        }).on('end', function() {
            console.log();
        });
    });*/



})
app.listen(5000);
