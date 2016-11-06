var React = require('react');
var styles = require('../styles/');

function MainContainer (props) {
    return (
        <div className="" style={styles.transparentBg}>
            {props.children}
        </div>
    )
}

module.exports = MainContainer;
