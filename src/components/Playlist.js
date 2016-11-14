var React = require('react');
var PropTypes = React.PropTypes;
import { Button, Icon, Image as ImageComponent, Item, Label } from 'semantic-ui-react'
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
const paragraph = <ImageComponent src='http://semantic-ui.com/images/wireframe/short-paragraph.png' />
var youtubeApi = require('../api/youtubeMusic');

// TODO break up into stateless functional container
//TODO once component mounts, setState Which is the album info
//TODO Always do render function first!!!!
function Playlist(props) {
    return (
        <div>Empty Playlist</div>
    )
}

/*var Playlist = React.createClass({

    render: function()  {
        return (

        )
    }
})

Playlist.propTypes = {
    accessToken: PropTypes.string.isRequired
}
*/
module.exports = Playlist;
