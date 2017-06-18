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

                {store.projects.map((project,index)=>
                    <MenuItem icon={<i className="fa fa-book" aria-hidden="true"></i>} onClick={()=>store.setCurrentProject(index)}>{project.name}</MenuItem>)}
            </Drawer>

        )
    }
}