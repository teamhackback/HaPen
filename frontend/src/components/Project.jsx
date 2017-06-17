import React, {Component} from 'react';
import {observer} from "mobx-react";
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';


@observer
export default class Project extends Component {
    render() {

        const store = this.props.store;

        return (
            <Paper zDepth={2} >
                <h1>{store.currentProject.name}</h1>



            </Paper>

        )
    }
}