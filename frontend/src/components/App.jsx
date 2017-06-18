import React from 'react';
import { observer } from "mobx-react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './Home';
import PrivateRoute from './PrivateRoute';
import Search from './Search';
import Issue from './Issue';
import Login from './Login';
import AppBarTop from './AppBarTop';
import './styles/App.scss';

@observer
export default class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBarTop store={this.props.store} />
          <Router>
            <div>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <PrivateRoute path="/search" component={Search} redirectTo="/login" store={this.props.store} />
              <PrivateRoute path="/issue" component={Issue} redirectTo="/login" store={this.props.store} />
            </div>
          </Router>
        </div>
            </MuiThemeProvider>
        );
    }
}
