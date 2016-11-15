var React = require('react');
var PropTypes = React.PropTypes;
import { Button, Icon, Image as ImageComponent, Item, Label, Grid } from 'semantic-ui-react'
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
const paragraph = <ImageComponent src='http://semantic-ui.com/images/wireframe/short-paragraph.png' />
var youtubeApi = require('../api/youtubeMusic');

var PlaylistItems = React.createClass({
    handlehandlePlaylistClicker: function (e) {
        e.preventDefault();
        console.log('hello, world');
        console.log(e.target.value)
    },
    render: function() {
        return (
            <Group >
                <Item >
                    <Image src={this.props.thumbnail}  />

                    <Content>
                        <Header as='a'>{this.props.title}</Header>
                        <Meta>
                            <span className='cinema'>Union Square 14</span>
                        </Meta>
                        <Description>{paragraph}</Description>
                        <Extra>
                            <Label>IMAX</Label>
                            <Label icon='globe' content='Additional Languages' />

                        </Extra>
                    </Content>
                </Item>
            </Group>
        )
    }
})

PlaylistItems.propTypes = {
    thumbnail:PropTypes.string.isRequired,
    title:PropTypes.string.isRequired,
};

module.exports = PlaylistItems;
