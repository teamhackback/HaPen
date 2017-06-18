import React from 'react';
import { observer } from "mobx-react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {grey900} from 'material-ui/styles/colors';

import Home from './Home';
import Issue from './Issue';
import Login from './Login';
import Search from './SearchResult';

import PrivateRoute from './PrivateRoute';
import AppBarTop from './AppBarTop';
import './styles/App.scss';


const muiTheme = getMuiTheme({
  appBar: {
    backgroundColor: grey900
  },
});

@observer
export default class App extends React.Component {
  render() {
    console.log(this.props.store.user);
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <AppBarTop store={this.props.store} />
          <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <PrivateRoute path="/search" component={Search} redirectTo="/login" store={this.props.store} />
                    <PrivateRoute path="/issue" component={Issue} redirectTo="/login" store={this.props.store} />
                </Switch>
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}
