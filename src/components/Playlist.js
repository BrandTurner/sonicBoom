var React = require('react');
var PropTypes = React.PropTypes;
import { Button, Icon, Image as ImageComponent, Item, Label, List } from 'semantic-ui-react'
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
var Link = require('react-router').Link;
const paragraph = <ImageComponent src='http://semantic-ui.com/images/wireframe/short-paragraph.png' />
var PlaylistItems = require('./PlaylistItems');
var Tracklist = require('./Tracklist');
var KCRWTracklist = require('./KCRWTracklist');
var KCRWTrack = require('./KCRWTrack');
var youtubeApi = require('../api/youtubeMusic');
const spotifyApi = require('../api/spotify');
var Promise = require('bluebird');
// TODO break up into stateless functional container
//TODO once component mounts, setState Which is the album info
//TODO Always do render function first!!!!
var Playlist = React.createClass({
    getInitialState: function() {
        console.log('initial state for Playlist');
        return {
            isLoading: true,
            youtubePlaylists: [], // empty array that will contain group of playlists
            tracks: [],
            kcrwTracks: [],
            kcrwTracksOnYoutube: [],
            youtubePlaylistsLoaded: false,
            kcrwPlaylistLoaded: false,
            youtubePlaylistId: '',
            counter:0,
            showSpotifyLogin: true,
            spotifyId: '',
        };
    },
    processTracks: function(payload) {
        this.setState({
            tracks: payload
        })
    },
    componentDidMount: function() {
        if (this.props.routeParams) {
            spotifyApi.setAccessToken(this.props.routeParams.spotifyAccessToken)
            spotifyApi.getMe()
                .then(function(data) {
                    this.setState({
                        spotifyId: data.id,
                        showSpotifyLogin: false,
                    })
                }.bind(this));
        }
    },
    componentDidUpdate: function() {
        //this.getLists();
    },
    getLists: function() {
        //TODO clean up
        if (this.props.accessToken != '') {
            youtubeApi.getPlaylists(this.props.accessToken)
                    .then(function(data) {
                        this.setState({
                            youtubePlaylists: data,
                        })
                    }.bind(this));
        }
    },
    callback: function(data) {
        console.log(data)
    },

    getKCRWPlaylist: function() {
        youtubeApi.getKCRWPlaylist('', this.callback)
            .then(function(data) {
                this.setState({
                    kcrwTracks: data,
                })
            }.bind(this))

    },
    addKCRWTracksToYoutube: function() {
        if (this.state.kcrwTracks) {
            youtubeApi.searchYoutubeForKCRW(this.state.kcrwTracks)
                .then(function(data){
                    this.setState({
                        kcrwTracksOnYoutube: data,
                    })
                }.bind(this));
        }
    },

    createYtPlaylist: function() {
        youtubeApi.createYoutubePlaylist(this.props.accessToken, 'name', 'desc')
            .then(function(data) {
                this.state.kcrwTracksOnYoutube.map((track) => {
                    youtubeApi.addToYoutubePlaylist(this.props.accessToken, data.data.id, track.videoId)
                    console.log(track.videoId);
                    return track;
                })
            }.bind(this))

    },

    createYtPlaylistDelay: function() {
        youtubeApi.createYoutubePlaylist(this.props.accessToken, 'name', 'desc')
            .then(function(response) {
                this.setState({
                    youtubePlaylistId: response.data.id,
                });
                return response;
            }.bind(this))
            .then(function(response) {
                this.addVideosLoop(this.state.kcrwTracksOnYoutube[0].videoId)
            }.bind(this))
    },

    addVideosLoop: function(videoId) {
        if (videoId !== 'not found') youtubeApi.addToYoutubePlaylist(this.props.accessToken, this.state.youtubePlaylistId, videoId);
        setTimeout(function(){
            this.state.counter++;
            if (this.state.counter < this.state.kcrwTracksOnYoutube.length) {
                this.addVideosLoop(this.state.kcrwTracksOnYoutube[this.state.counter].videoId);
                console.log('Adding ' + this.state.kcrwTracksOnYoutube[this.state.counter].videoId + ' to the playlist.');
            }
        }.bind(this), 3000);
    },
    spotifyTest: function() {
        console.log('Access ', this.props.routeParams.spotifyAccessToken);
        console.log('Refresh ', this.props.routeParams.spotifyRefreshToken);
        this.spotifySearch()
            .then(function(data) {
                this.setState({
                    kcrwTracks: data,
                });
            }.bind(this));
    },
    spotifySearch: function() {
        if (this.state.kcrwTracks) {
            var promises = (this.state.kcrwTracks.filter((kcrwTrack) => kcrwTrack.artist !== '[BREAK]')
                    .map(function(kcrwTrack) {
                        return (
                            spotifyApi.searchTracks(kcrwTrack.artist + ' ' + kcrwTrack.title, {limit: 1})
                                .then(function(data) {
                                    if (data.tracks.items[0]) {
                                        console.log(data.tracks.items[0].id)
                                        kcrwTrack.spotifyId = data.tracks.items[0].id
                                        return kcrwTrack;
                                    } else {
                                        console.log('not found');
                                        kcrwTrack.spotifyId = null;
                                        return kcrwTrack;
                                    }
                                }, (err) => {
                                    console.error(err);
                                    kcrwTrack.spotifyId = null;
                                    return kcrwTrack;
                                })
                        )
                    })
                )
            return Promise.all(promises)
        }
        //spotifyApi.search
        //spotifyApi.searchSpotify('Michael Jackson', 'Smooth Criminal')
    },
    reduceSpotify: function() {
        let count = 0;
        const promiseFor = Promise.method(function(condition, action, value) {
            if (!condition(value)) return value;
            return action(value).then(promiseFor.bind(null, condition, action));
        });

        var arr = this.state.kcrwTracks.filter((kcrwTrack) => kcrwTrack.spotifyId !== null)
            .map(function(track) {
                return 'spotify:track:' + track.spotifyId
            })

        var spotifyTracks = this.createChunkedArray(arr.reverse(), 100);

        // TODO clean up. Current code creates multiple playlists.
        // Create one playlist, then multiple add Tracks - for now just enger first 100
        spotifyApi.createPlaylist(this.state.spotifyId, {name: 'KCRW Playlist Hellz YEAH'})
            .then(function(data){
                //data.id
                console.log('Playlist ID: ', data.id);;
                console.log('My Id', this.state.spotifyId);
                console.log('spotifyTracks', spotifyTracks);
                return spotifyApi.addTracksToPlaylist(this.state.spotifyId, data.id, spotifyTracks[0]);
            }.bind(this))
        // TODO clean up. Current code creates multiple playlists.
        // Create one playlist, then multiple add Tracks
        {/*
            promiseFor(function(count) {
                return count < spotifyTracks.length
            }, function(count) {
                return spotifyApi.createPlaylist(this.state.spotifyId, {name: 'KCRW Playlist Hellz YEAH'})
                    .then(function(data){
                        //data.id
                        console.log('Playlist ID: ', data.id);;
                        console.log('My Id', this.state.spotifyId);
                        console.log('spotifyTracks', spotifyTracks);
                        return spotifyApi.addTracksToPlaylist(this.state.spotifyId, data.id, spotifyTracks[count]);
                    }.bind(this))
                    .then(function(data){
                        console.log(data);
                        return ++count;
                    });
            }.bind(this), 0).then(console.log.bind(console,'all done'))*/
        }
    },

    createChunkedArray: function(spotifyTracks, chunkSize) {
        let chunkedTracks = [];
        while(spotifyTracks.length > 0) chunkedTracks.push(spotifyTracks.splice(0, chunkSize));
        return chunkedTracks;
    },

    render: function()  {
        const items = this.state.youtubePlaylists.map((item) =>
            <PlaylistItems key={item.playlistId}
                playlistId={item.playlistId}
                thumbnail={item.thumbnail}
                title={item.title}
                accessToken={this.props.accessToken}
                processTracks={this.processTracks}
            />
        );
            // Make exception for breaks
            // Handle no thumbnails
            // generate unique ID
            const kcrwTracks = this.state.kcrwTracksOnYoutube.map((track) =>
                <KCRWTrack
                    album           = {track.album}
                    artist          = {track.artist}
                    host            = {track.host}
                    program_title   = {track.program_title}
                    thumbnailLarge  = {track.thumbnailLarge}
                    youtube_link    = {track.youtube_link}
                    thumbnail       = {track.thumbnail}
                    title           = {track.title}
                    videoId         = {track.videoId}
                    datetimeString  = {track.datetimeString}
                />
            );


        return (
            <div>


                <div style={Playlist.styles.div}>
                    {this.state.showSpotifyLogin &&
                        <a href='http://localhost:5000/login'>
                            <button>
                                Login to Spotify
                            </button>
                        </a>
                    }
                    {!this.state.showSpotifyLogin &&
                        <div>
                            <button onClick={this.spotifyTest}>
                                Spotify
                            </button>
                            <button onClick={this.reduceSpotify}>
                                Reduce
                            </button>
                        </div>
                            }
                    {/*
                        <a href='http://localhost:5000/login'>
                        <button onClick={this.getLists}>
                            Login to Spotify
                        </button>
                        </a>
                        <button onClick={this.spotifyTest}>
                        Spotify
                        </button>

                            <button onClick={this.getLists}>
                        Login to Google
                        </button>
                        <button onClick={this.createYtPlaylistDelay}>
                        Create Youtube Playlist
                        </button>
                        <button onClick={this.spotifyTest}>
                        Spotify
                        </button>
                        <button onClick={this.reduceSpotify}>
                        Reduce
                        </button>
                    <ul style={Playlist.styles.ul}>
                        {items}
                    </ul>
                */}
                </div>
                <div style={Playlist.styles.list}>
                    <Tracklist tracks={this.state.tracks} />
                </div>

                <div style={Playlist.styles.div}>
                    <button onClick={this.getKCRWPlaylist}>
                        Download KCRW list
                    </button>
                    <button onClick={this.addKCRWTracksToYoutube}>
                        Search Youtube for KCRW Tracks and display links
                    </button>
                    <ul style={Playlist.styles.ul}>
                        {kcrwTracks}
                    </ul>
                </div>
            </div>
        );
    }
});

Playlist.styles = {
  div: {
    width: 370,
    marginLeft: 30,
    textAlign: 'right',
    maxHeight: '85vh',
    overflowY: 'auto',
    float: 'left',
  },
  list: {
      float: 'left',
  },
  ul: {
    listStyle: 'none',
  },
};

Playlist.propTypes = {
    accessToken: PropTypes.string
};

module.exports = Playlist;
