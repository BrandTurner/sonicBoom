var SpotifyWebApi = require('spotify-web-api-js');
var spotifyApi = new SpotifyWebApi();
var Q = require('q');

spotifyApi.setPromiseImplementation(Q);

module.exports = spotifyApi;
