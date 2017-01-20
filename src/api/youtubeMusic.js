var axios = require('axios');
var moment = require('moment');
var Promise = require('bluebird');

// youtube-api
var _               = require('underscore');
var youtube_node    = require('youtube-node');

var youtube = new youtube_node();
var youtubeSearch = Promise.promisify(youtube.search);

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
            datetimeString: trackObject.datetime ? moment(trackObject.datetime).format("h:mm:ss MMM D YY") : '',
            album: trackObject.album,
            youtube_link: '',
            videoId: '',
        };
    }));
}

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
        const fuckCors = 'http://localhost:5000/kcrw' //+  moment().subtract(1, 'days').format("YYYY/MM/DD");
        //const request = 'https://tracklist-api.kcrw.com/Simulcast/date/' + moment().subtract(1, 'days').format("YYYY/MM/DD");


        return axios.get(fuckCors, meta)
            .then(processKCRWTracks)
            .then(function(kcrwTracks) {
                return kcrwTracks;
            });

    },
    searchYoutubeForKCRW(trackObject) {
        var promises = (trackObject.map(function(kcrwTrack) {
                return youtubeSearch(kcrwTrack.artist + ' ' + kcrwTrack.title, 1)
                        .then(function(res) {
                            kcrwTrack.videoId       = res.items[0].id.videoId;
                            kcrwTrack.youtube_link  = 'https://youtube.com/watch?v=' + res.items[0].id.videoId;

                            return kcrwTrack;
                        })
                        .then(function(result) {
                            return result;
                        })
                        .catch(function(error) {
                            console.log('ERROR:');
                        })

            })
        )
        return Promise.all(promises);
    },
    createPlaylist(token,name, description) {
        var meta = {
            headers: {'authorization': 'Bearer ' + token },
            params: {
                alt: 'json',
                part: 'snippet,status',
                key: key
            }
        };

        return axios.post('https://content.googleapis.com/youtube/v3/playlists',{snippet: {title: "Just got Pizza", description: "needed it"}, status: {privacyStatus: "private"}}, meta)
            .then(function(response) {
                console.log(response);
                return(response);
            });
    },



};

module.exports = helpers;
