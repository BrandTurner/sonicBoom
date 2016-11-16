var React = require('react');
var PropTypes = React.PropTypes;
import { Button, Icon, Image as ImageComponent, Item, Label } from 'semantic-ui-react'
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
const paragraph = <ImageComponent src='http://semantic-ui.com/images/wireframe/short-paragraph.png' />
var youtubeApi = require('../api/youtubeMusic');
var PlaylistItems = require('./PlaylistItems');

// TODO break up into stateless functional container
//TODO once component mounts, setState Which is the album info
//TODO Always do render function first!!!!
var Playlist = React.createClass({
    getInitialState: function() {
        console.log('initial state for Playlist');
        return {
            accessToken:'',
            isLoading: true,
            playlist: [] // empty array that will contain group of playlists
        };
    },
    componentDidMount: function() {
        // make call to get playlist
        // Refactor => This should not appear until we have determined to be logged in
        this.setState({
            accessToken: this.props.accessToken
        })
        if (this.state.accessToken) console.log('hello, world')
    },
    componentDidUpdate: function() {
        console.log('Processing');
    },
    render: function()  {
        const items = this.state.playlist.map((item) =>
            <PlaylistItems key={item.playlistId} thumbnail={item.thumbnail} title={item.title} />);

        return (
            <div style={Playlist.styles.div}>
                <ul style={Playlist.styles.ul}>
                    {items}
                </ul>
            </div>
        );
    }
});

Playlist.styles = {
    div     : {
        width     : 370,
        marginLeft: 30,
        textAlign : 'right',
        maxHeight : '85vh',
        overflowY : 'auto',
    },
    ul          : {
      listStyle : 'none',
    },
}

Playlist.propTypes = {
    accessToken: PropTypes.string.isRequired
};

module.exports = Playlist;
