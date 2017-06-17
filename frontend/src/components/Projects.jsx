import React, {Component} from 'react';
import {observer} from "mobx-react";
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';


@observer
export default class Projects extends Component {
    render() {

        const store = this.props.store;

        return (
            <Drawer open={()=>{}}>
                <MenuItem>Menu Item</MenuItem>
                <MenuItem>Menu Item 2</MenuItem>
            </Drawer>

        )
    }
}