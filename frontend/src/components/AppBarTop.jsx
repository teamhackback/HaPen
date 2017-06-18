import React from 'react';
import AppBar from 'material-ui/AppBar';

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
        <AppBar title="haPen" onLeftIconButtonTouchTap={this.handleDrawerToggle} />
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