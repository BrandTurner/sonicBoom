var React = require('react');
var PropTypes = React.PropTypes;
import { Button, Icon, Image as ImageComponent, Item, Label, Grid } from 'semantic-ui-react'
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
const paragraph = <ImageComponent src='http://semantic-ui.com/images/wireframe/short-paragraph.png' />
var youtubeApi = require('../api/youtubeMusic');

var PlaylistItems = React.createClass({
    getInitialState: function() {
        console.log('initial state for Playlist');
        return {
            isLoading: true,
            tracks: [] // empty array that will contain group of playlists
        };
    },
    getTracks: function() {
        youtubeApi.getTracks(this.props.accessToken, this.props.playlistId, this.props.processTracks)
                .then(function(data) {
                    console.log('googbye');
                })
    },
    handlehandlePlaylistClicker: function (e) {
        e.preventDefault();
        console.log('hello, world');
        console.log(e.target.value)
    },
    render: function() {
        return (
            <div onClick={this.getTracks}>
                <Group >
                    <Item >
                        <Image src={this.props.thumbnail}  />

                        <Content>
                            <Header as='a'>{this.props.title}</Header>
                            <Meta>
                                <span className='cinema'>{this.props.playlistId}</span>
                            </Meta>
                            <Description>{paragraph}</Description>
                            <Extra>
                                <Label>Download</Label>
                                <Label icon='globe' content='Additional Languages' />

                            </Extra>
                        </Content>
                    </Item>
                </Group>
            </div>
                )
    }
})

PlaylistItems.propTypes = {
    accessToken:PropTypes.string.isRequired,
    playlistId:PropTypes.string.isRequired,
    thumbnail:PropTypes.string.isRequired,
    title:PropTypes.string.isRequired,
    processTracks:PropTypes.func.isRequired,
};

module.exports = PlaylistItems;
