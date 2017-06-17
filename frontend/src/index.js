import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import observableAppStore from './store.jsx'

ReactDOM.render(
  <App store={ observableAppStore }/>,
  document.getElementById('root')
);
