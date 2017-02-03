var React = require('react');
var PropTypes = React.PropTypes;
import { Button, Icon, Image as ImageComponent, Item, Label, List } from 'semantic-ui-react'
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
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
        };
    },
    processTracks: function(payload) {
        this.setState({
            tracks: payload
        })
    },
    componentDidMount: function() {
        // make call to get playlist
        // Refactor => This should not appear until we have determined to be logged in
        this.getLists();
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
        var arr = this.state.kcrwTracks.filter((kcrwTrack) => kcrwTrack.spotifyId !== null)
            .map(function(track) {
                return track.spotifyId
            })
        console.log(arr)

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
    accessToken: PropTypes.string.isRequired
};

module.exports = Playlist;
