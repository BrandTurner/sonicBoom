var axios = require('axios');
var moment = require('moment');

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

function stupidCallback(payload) {
    console.table(payload);
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
        const request = 'https://tracklist-api.kcrw.com/Simulcast/date/' + moment().subtract(1, 'days').format("YYYY/MM/DD");


        return axios.get(request)
            .then(stupidCallback)
            .then(function(payload) {
                return payload;
            })
    }

};

module.exports = helpers;
