var React = require('react');
var MainContainer = require('./MainContainer');
import { Grid, Image, Segment } from 'semantic-ui-react'

var Home = React.createClass({
    render: function() {
        return (
            <MainContainer>
                <h1>Github Battle</h1>
                <p>Some fancy motto</p>

                <div id="login-container">This application requires access to your YouTube account.
                    Please <a href="#" id="login-link">authorize</a> to continue.
                </div>

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
