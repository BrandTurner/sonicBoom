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
                    <List.Icon name='github' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a' href={'https://youtube.com/watch?v=' + this.props.videoId}>{this.props.title}</List.Header>
                        <List.Description as='a' href={'http://localhost:5000/download/' +
                        this.props.videoId + '?title=' + this.props.title + '&playlist=false'}>Updated 10 mins ago</List.Description>
                    </List.Content>
                </List.Item>
            </List>
        )
    }
})

KCRWTrack.propTypes = {
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    videoId: PropTypes.string.isRequired,
};

module.exports = KCRWTrack;
