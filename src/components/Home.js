var React = require('react');
var MainContainer = require('./MainContainer');
import { Grid, Image, Segment } from 'semantic-ui-react';
import { GoogleLogin } from 'react-google-login-component';

var Home = React.createClass({
    handleGoogleResponse: function(googleUser) {
        var id_token = googleUser.getAuthResponse().id_token;
        console.log({accessToken: id_token});
        console.log({User: googleUser});
        //anything else you want to do(save to localStorage)...
    },
    render: function() {
        return (
            <MainContainer>
                <h1>Github Battle</h1>
                <p>Some fancy motto</p>

                <div id="login-container">This application requires access to your YouTube account.
                    Please <a href="#" id="login-link">authorize</a> to continue.
                </div>

                <GoogleLogin socialId="520012681222-mnejve8atjj13r6rr0ellm6s1eltpip9.apps.googleusercontent.com"
                    class="google-login"
                    scope="profile"
                    responseHandler={this.handleGoogleResponse}
                    buttonText="Login With Google"/>

                <Grid stackable columns={2}>
                    <Grid.Column>
                        <Segment>
                            <Image src='http://semantic-ui.com/images/wireframe/paragraph.png' />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment>
                            <Image src='http://semantic-ui.com/images/wireframe/paragraph.png' />
                        </Segment>
                    </Grid.Column>
                </Grid>
            </MainContainer>
        )
    }
});

module.exports = Home;
