var React = require('react');
var MainContainer = require('./MainContainer');
import { Grid, Segment } from 'semantic-ui-react';
import { Container, Button, Icon, Image as ImageComponent, Item, Label, List } from 'semantic-ui-react'
import { GoogleLogin } from 'react-google-login-component';
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
const paragraph = <ImageComponent src='http://semantic-ui.com/images/wireframe/short-paragraph.png' />
import * as youtubeApi from '../api/youtubeMusic';
var Playlist = require('./Playlist')
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var floater = require('../styles/').floater;
var buttonPadding = require('../styles/').buttonPadding;
import * as youtubeApi from '../api/youtubeMusis';
var youtubeApi = require('../api/youtubeMusic');

var Home = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            accessToken: '',
            showPlaylist: false,
            showTracklist: false,
        }
    },

    handleUpdateAccessToken: function(accessToken) {
        this.setState({
            accessToken: accessToken,
        });
        console.log(this.state.accessToken)
    },
    handleGoogleResponse: function(googleUser) {
        //TODO check to see if logged in
        this.handleUpdateAccessToken(googleUser.Zi.access_token);
    },
    handleButtonClick: function() {
        this.setState({
            showPlaylist: true,
        });
    },
    handleIt: function() {
        console.log('hello, world');
    },
    // TODO Refactor and put in it's own component
    // guide => https://github.com/auth0-blog/react-flux-jwt-authentication-sample
    // https://github.com/auth0-blog/redux-auth
    // https://scotch.io/tutorials/build-a-react-flux-app-with-user-authentication
    //TODO header and footet components
    render: function() {
        return (
                <Container fluid>
                    <Header as='h1'> KCRW Playlist App</Header>

                    <GoogleLogin socialId="520012681222-mnejve8atjj13r6rr0ellm6s1eltpip9.apps.googleusercontent.com"
                        class="google-login"
                        scope="profile"
                        responseHandler={this.handleGoogleResponse}
                        buttonText="Login With Google"

                    />

                    <div>
                        <Button onClick={this.handleButtonClick} style={buttonPadding}>
                            Click Here after accessToken is set
                        </Button>
                    </div>

                    {this.state.showPlaylist ?
                        <div>
                            <div className='trackList'>
                                <Playlist accessToken={this.state.accessToken} getTracks={}/>
                            </div>
                        </div>
                        :
                        null
                    }

                </Container>
        )
    }
});



module.exports = Home;
