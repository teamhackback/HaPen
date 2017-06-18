import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import observableAppStore from './stores/store.jsx'
import injectTapEventPlugin from 'react-tap-event-plugin';
import './styles/index.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <App store={ observableAppStore }/>,
  document.getElementById('root')
);
registerServiceWorker();
