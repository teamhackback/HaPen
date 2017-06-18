import React from 'react';
import AppBar from 'material-ui/AppBar';
import TextWhiteLogo from '../../public/text-white-logo.svg';

import DrawerMenu from './DrawerMenu';

export default class AppBarTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    };
  }

  handleDrawerToggle = (e) => {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  }

  handleRequestChange = (open) => {
    this.setState({
      drawerOpen: open
    });
  }

  handleClose = () => {
    this.setState({
      drawerOpen: false
    });
  }


  render() {
    return (
      <div>
        <AppBar title={<img src={TextWhiteLogo} style={{height:60}} alt="haPen logo"/>} onLeftIconButtonTouchTap={this.handleDrawerToggle} />
        <DrawerMenu
          store={this.props.store}
          open={this.state.drawerOpen}
          closeHandler={this.handleClose}
          requestChangeHandler={this.handleRequestChange}
        />
      </div>
    );
  }
}