import React, {Component} from 'react';
import {observer} from "mobx-react";
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
    Step,
    Stepper,
    StepLabel,
} from 'material-ui/Stepper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import {List, ListItem} from 'material-ui/List';

@observer
export default class Timeline extends Component {
    render() {

        const store = this.props.store;

        return (
            <List>


                {store.events.map((event,index)=>(
                    <ListItem
                        key={index}
                        //leftAvatar={<Avatar src="images/raquelromanp-128.jpg" />}
                        //rightIconButton={rightIconMenu}
                        primaryText={event.type+' | '+event.project.name}
                        secondaryText={
                            <p>
                                {event.project.message}
                            </p>
                        }
                        secondaryTextLines={2}
                    />



                ))}



            </List>

        )
    }
}