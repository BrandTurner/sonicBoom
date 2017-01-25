var React = require('react');
var PropTypes = React.PropTypes;
import { Button, Icon, Image as ImageComponent, Item, Label, List } from 'semantic-ui-react'
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
const paragraph = <ImageComponent src='http://semantic-ui.com/images/wireframe/short-paragraph.png' />


var KCRWTrack = React.createClass({

    render: function() {
        return (
            <List divided relaxed>
                <List.Item>
                    <Image src={this.props.thumbnail} size='tiny' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a' href={'http://localhost:5000/api/download/' + this.props.videoId
                        + '?title=' + this.props.title + '&playlist=false'}>{this.props.title}</List.Header>
                        <List.Header>{this.props.artist}</List.Header>
                        <List.Description>{this.props.album}</List.Description>
                        <List.Description>{this.props.program_title} @ {this.props.datetimeString}</List.Description>
                    </List.Content>
                </List.Item>
            </List>
        )
    }
})


KCRWTrack.propTypes = {
    album: PropTypes.string,
    artist: PropTypes.string,
    host: PropTypes.string,
    program_title: PropTypes.string,
    thumbnailLarge: PropTypes.string,
    youtube_link: PropTypes.string,
    videoId: PropTypes.string,
    datetimeString: PropTypes.string,

    thumbnail: PropTypes.string,
    title: PropTypes.string
};

module.exports = KCRWTrack;
