var axios = require('axios');
var moment = require('moment');
// youtube-api
const Youtube       = require('youtube-api')
    , readJson      = require('r-json')
    , Lien          = require('lien')
    , Logger        = require('bug-killer')
    , opn           = require('opn')
    , prettyBytes   = require('pretty-bytes');

var _               = require('underscore');
var youtube_node    = require('youtube-node');

var youtube = new youtube_node();
var key = 'AIzaSyDZ0pd6pFiiwuCOfV3nhQBbmRU2VuiDRWA';
youtube.setKey(key);

function processPlaylist(playlistItems) {
    return (playlistItems.data.items.map(function (playlistItems) {
        return {
            thumbnail: playlistItems.snippet.thumbnails.default.url,
            title: playlistItems.snippet.title,
            playlistId: playlistItems.id
        };
    }));
}

function processTracks(tracks) {
    return (tracks.data.items.map(function(trackObject) {
        return {
            thumbnail: trackObject.snippet.thumbnails.default.url,
            title: trackObject.snippet.title,
            videoId: trackObject.snippet.resourceId.videoId,
        }
    }))
}

function processKCRWTracks(tracks) {
    return (tracks.data.map(function(trackObject){
        return {
            host: trackObject.host,
            program_title: trackObject.program_title,
            program_start: trackObject.program_start,
            program_end: trackObject.program_end,
            thumbnail: trackObject.albumImage,
            thumbnailLarge: trackObject.albumImageLarge,
            artist: trackObject.artist,
            title: trackObject.title,
            datetime_played: trackObject.datetime,
            album: trackObject.album
        };
    }));
}

function searchYoutubeForKCRW(youtubeObj, trackObject) {
    youtubeObj.search(trackObject[87].artist + ' ' + trackObject[87].title, 20, function(err, res) {
        if (err) {
          console.error(err);
        } else if (!res.items.length) {
          console.error('Zero length');
        } else {
            console.log('Youtube search successful');
            console.table(res);
            var ids = _.map(res.items, function(item) {
                if (item.id.kind === 'youtube#video') {
                  return item.id.videoId;
                }
              });
              return ids;
        }
    })
}

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

//https://content.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=snippet&playlistId=PLNXQWMqiSM3ANXivcNXdp5At4DDlSmOVN&key=AIzaSyD-a9IF8KKYgoC3cpgS-Al7hLQDbugrDcw
var helpers = {
    getPlaylists: function (token) {
        var meta = {
            headers: {'authorization': 'Bearer ' + token },
            params: {
                mine: true,
                part: 'snippet',
                maxResults: 50
            }
        };

        return axios.get('https://content.googleapis.com/youtube/v3/playlists', meta)
            .then(processPlaylist)
            .then(function (playlistIds) {
                return(playlistIds);
            });
    },

    getTracks: function (token, playlistId, callback) {
        var meta = {
            headers: {'authorization': 'Bearer ' + token },
            params: {
                playlistId: playlistId,
                part: 'snippet',
                maxResults: 50
            }
        };


        // TODO return array of title, thumbnail objs
        return axios.get('https://content.googleapis.com/youtube/v3/playlistItems', meta)
            .then(processTracks)
            .then(function (trackData) {
                console.table(trackData);
                callback(trackData);
                return trackData;
            });
    },

    //TODO  Expand function such that you can pass an options object that
    // specifies when to look/what to look for
    // eg. by host, by date, by time, etc.
    // starting with date
    getKCRWPlaylist(date, callback) {
        var meta = {

        };
        const fuckCors = 'http://theacademy.ggtv:5000/kcrw' //+  moment().subtract(1, 'days').format("YYYY/MM/DD");
        //const request = 'https://tracklist-api.kcrw.com/Simulcast/date/' + moment().subtract(1, 'days').format("YYYY/MM/DD");


        return axios.get(fuckCors, meta)
            .then(processKCRWTracks)
            .then(function(payload) {
                console.table(payload);
                callback(payload);
                return payload;
            })
    },

};

module.exports = helpers;
