var React = require('react');
var PropTypes = React.PropTypes;
import { Button, Icon, Image as ImageComponent, Item, Label } from 'semantic-ui-react'
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
const paragraph = <ImageComponent src='http://semantic-ui.com/images/wireframe/short-paragraph.png' />
var youtubeApi = require('../api/youtubeMusic');

// TODO break up into stateless functional container
//TODO once component mounts, setState Which is the album info
//TODO Always do render function first!!!!
var Playlist = React.createClass({
    getInitialState: function() {
        console.log('initial state for Playlist');
        return {
            isLoading: true,
            playlist: [] // empty array that will contain group of playlists
        }
    },
    componentWillMount: function() {
        console.log('componentWillMount')
    },
    componentDidMount: function() {
        // make call to get playlist
        // Refactor => This should not appear until we have determined to be logged in
        var accessToken = this.props.accessToken;

        youtubeApi.getPlaylists(accessToken)
                .then(function(data) {
                    console.log(data);
                });
    },
    render: function()  {
        return (
            <Group divided>
                <Item>
                    <Image src='http://semantic-ui.com/images/wireframe/image.png' />

                    <Content>
                        <Header as='a'>My Neighbor Totoro</Header>
                        <Meta>
                            <span className='cinema'>IFC Cinema</span>
                        </Meta>
                        <Description>{paragraph}</Description>
                        <Extra>
                            <Button primary floated='right'>
                                Buy tickets
                                <Icon name='right chevron' />
                            </Button>
                            <Label>Limited</Label>
                        </Extra>
                    </Content>
                </Item>
            </Group>
        )
    }
})

Playlist.propTypes = {
    accessToken: PropTypes.string.isRequired
}

module.exports = Playlist;
