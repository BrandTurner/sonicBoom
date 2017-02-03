var SpotifyWebApi = require('spotify-web-api-js');
var spotifyApi = new SpotifyWebApi();
var Q = require('q');

spotifyApi.setPromiseImplementation(Q);

const helpers = {
    searchSpotify: function (artist, title) {
        spotifyApi.searchTracks(artist + ' ' + title, {limit: 1})
            .then((data) => {
                console.log(data.tracks.items[0].id);
                return(data.tracks.items[0].id);
        }, (err) => {
            console.error(err);
        });
    }
};

module.exports = spotifyApi;
