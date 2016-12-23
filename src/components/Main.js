var React = require('react');
import Reactotron from 'reactotron-react-js'

var Main = React.createClass({
    render: function() {
        Reactotron.log({ numbers: [1, 2, 3], boolean: false, nested: { here: 'we go' } });
        Reactotron.warn('*glares*')
        Reactotron.error('Now you\'ve done it.')
        Reactotron.display({
          name: 'KNOCK KNOCK',
          preview: 'Who\'s there?',
          value: 'Orange.'
        })

        Reactotron.display({
          name: 'ORANGE',
          preview: 'Who?',
          value: 'Orange you glad you don\'t know me in real life?',
          important: true
        })
        return (
            <div className=''>
                {this.props.children}
            </div>
        )
    }
})

module.exports = Main;
