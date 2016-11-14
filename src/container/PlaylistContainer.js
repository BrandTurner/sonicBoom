var React = require('react');
var Playlist = require('../components/Playlist')

var PlaylistContainer = React.createClass({
    contextTypes: {
        
    }
    render: function() {
        return (
            <Playlist />
        );
    }
})

module.exports = PlaylistContainer;
