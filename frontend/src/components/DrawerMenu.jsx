import React from 'react';
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

@observer
class DrawerMenu extends React.Component {
  handleLogin = () => {
    window.location.assign('https://hapen.hackback.tech/api/user/login/github')
  }

  handleLogout = () => {
    window.location.assign('https://hapen.hackback.tech/api/user/logout')
  }
  render() {
    return (
      <div>
        <Router>
          <Drawer docked={false} open={this.props.open} onRequestChange={this.props.requestChangeHandler}>
            {
              this.props.store.user ? (
                <div>
                  <Link to='/search'><MenuItem>Search</MenuItem></Link>
                  <MenuItem onTouchTap={this.handleLogout}>Logout</MenuItem>
                </div>
              ) : (<MenuItem onTouchTap={this.handleLogin}> Login </MenuItem>)
            }
          </Drawer>
        </Router>
      </div>
    );
  }
}

DrawerMenu.contextTypes = {
  router: PropTypes.object
};

export default DrawerMenu;
