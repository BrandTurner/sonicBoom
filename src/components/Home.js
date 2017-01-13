var React = require('react');
var Playlist = require('./Playlist');
import { GoogleLogin } from 'react-google-login-component';
var moment = require('moment');

var Home = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            accessToken: '',
            playlists: [],
            tracks: [],
            theDate: moment().subtract(1, 'days').format("YYYY/MM/DD")
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
        this.handleUpdateAccessToken(googleUser.Zi.access_token)

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
                <div>
                    <h1> KCRW Playlist App for {this.state.theDate}</h1>

                    <GoogleLogin socialId="520012681222-mnejve8atjj13r6rr0ellm6s1eltpip9.apps.googleusercontent.com"
                        class="google-login"
                        scope="profile"
                        responseHandler={this.handleGoogleResponse}
                        buttonText="Login With Google"

                    />

                    <div>
                        <Playlist accessToken={this.state.accessToken} />
                    </div>


                </div>
        )
    }
});



module.exports = Home;
