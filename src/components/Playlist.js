var React = require('react');
var PropTypes = React.PropTypes;
import { Button, Icon, Image as ImageComponent, Item, Label, List } from 'semantic-ui-react'
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
const paragraph = <ImageComponent src='http://semantic-ui.com/images/wireframe/short-paragraph.png' />
var PlaylistItems = require('./PlaylistItems');
var Tracklist = require('./Tracklist');
var youtubeApi = require('../api/youtubeMusic');


// TODO break up into stateless functional container
//TODO once component mounts, setState Which is the album info
//TODO Always do render function first!!!!
var Playlist = React.createClass({
    getInitialState: function() {
        console.log('initial state for Playlist');
        return {
            isLoading: true,
            playlists: [], // empty array that will contain group of playlists
            tracks: []
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
    },
    componentDidUpdate: function() {
    },
    getLists: function() {
        if (this.props.accessToken != '') {
            youtubeApi.getPlaylists(this.props.accessToken)
                    .then(function(data) {
                        this.setState({
                            playlists: data,
                        })
                        console.log(this.state.playlists);
                    }.bind(this));
        }
        youtubeApi.getKCRWPlaylist('date', 'callback');
    },
    render: function()  {
        const items = this.state.playlists.map((item) =>
            <PlaylistItems key={item.playlistId}
                playlistId={item.playlistId}
                thumbnail={item.thumbnail}
                title={item.title}
                accessToken={this.props.accessToken}
                processTracks={this.processTracks}
            />);


        return (
            <div>
                <div style={Playlist.styles.div}>
                    <button onClick={this.getLists}>
                        Frack
                    </button>
                    <ul style={Playlist.styles.ul}>
                        {items}
                    </ul>
                </div>
                <div style={Playlist.styles.list}>
                    <Tracklist tracks={this.state.tracks} />
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
