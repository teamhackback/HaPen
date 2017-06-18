import React from 'react';
import {
  Link
} from 'react-router-dom';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import { Card, CardHeader } from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

@observer
class DrawerMenu extends React.Component {
  handleLogin = () => {
    this.props.closeHandler();
    window.location.assign('https://hapen.hackback.tech/api/user/login/github')
  }

  handleLogout = () => {
    this.props.closeHandler();
    window.location.assign('https://hapen.hackback.tech/api/user/logout')
  }
  render() {
    return (
      <div>
        <Drawer docked={false} open={this.props.open} onRequestChange={this.props.requestChangeHandler}>
          {
            this.props.store.user ? (
              <div>
                <Card>
                  <CardHeader
                    title={window.SESSION_USER.name}
                    subtitle={window.SESSION_USER.email}
                    avatar={window.SESSION_USER.avatarUrl}
                  />
                </Card>
                <MenuItem onTouchTap={this.props.closeHandler} containerElement={<Link to='/search' />} leftIcon={<FontIcon className="material-icons">search</FontIcon>}>Search</MenuItem>
                <MenuItem onTouchTap={this.handleLogout} leftIcon={<FontIcon className="material-icons">exit_to_app</FontIcon>}>Logout</MenuItem>
              </div>
            ) : (<MenuItem onTouchTap={this.handleLogin} leftIcon={<FontIcon className="material-icons">face</FontIcon>}> Login </MenuItem>)
          }
        </Drawer>
      </div>
    );
  }
}

DrawerMenu.contextTypes = {
  router: PropTypes.object
};

export default DrawerMenu;
