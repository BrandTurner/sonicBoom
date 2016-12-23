import './ReactotronConfig'
var React = require('react');
var ReactDOM = require('react-dom');
//import App from './App';
import './index.css';
var routes = require('./config/routes');

ReactDOM.render(
  routes,
  document.getElementById('root')
);
