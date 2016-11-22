var React = require('react');
var PropTypes = React.PropTypes;
import { Button, Icon, Image as ImageComponent, Item, Label, List } from 'semantic-ui-react'
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
const paragraph = <ImageComponent src='http://semantic-ui.com/images/wireframe/short-paragraph.png' />
var Track = require('./Track.js');

var Tracklist = React.createClass({

    render: function() {
        const tracks = this.props.tracks.map((track) =>
            <Track key={track.videoId}
                thumbnail={track.thumbnail}
                title={track.title}
                videoId={track.videoId}
            />);

        return (
            <div>
                {tracks}
            </div>
        )
    }
})

Tracklist.propTypes = {
    tracks: PropTypes.array.isRequired,
};

module.exports = Tracklist;
