var React = require('react');
var MainContainer = require('./MainContainer');
import { Grid, Segment } from 'semantic-ui-react';
import { Container, Button, Icon, Image as ImageComponent, Item, Label } from 'semantic-ui-react'
import { GoogleLogin } from 'react-google-login-component';
const { Content, Description, Extra, Group, Header, Image, Meta } = Item
const paragraph = <ImageComponent src='http://semantic-ui.com/images/wireframe/short-paragraph.png' />
import * as youtubeApi from '../api/youtubeMusic';
var Playlist = require('./Playlist')
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var styles = require('../styles/');

var Home = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            accessToken: ''
        }
    },
    handleUpdateAccessToken: function(accessToken) {
        this.setState({
            accessToken: accessToken
        });
    },
    handleGoogleResponse: function(googleUser) {
        //TODO check to see if logged in
        this.handleUpdateAccessToken(googleUser.Zi.access_token);
    },
    handleGetPlaylist: function() {
        this.context.router.push({
            pathname: '/playlists',
            query: {
                accessToken: this.state.accessToken
            }
        });
    },
    handleOAuthClosed: function() {

    },
    // TODO Refactor and put in it's own component
    // guide => https://github.com/auth0-blog/react-flux-jwt-authentication-sample
    // https://github.com/auth0-blog/redux-auth
    // https://scotch.io/tutorials/build-a-react-flux-app-with-user-authentication
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
                    
                    <Link to='/playlists'>
                        <Button style={styles.buttonPadding}>
                            Click Here after accessToken is set
                        </Button>
                    </Link>
                </Container>
        )
    }
});

module.exports = Home;
