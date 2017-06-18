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
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import moment from 'moment';
import  './Issue.scss';


let events = [];

for (let i = 100; i > 0; i--) {
    events.push({
        type: Math.random() > 0.95 ? 'APPROVED' : 'NORMAL',
        author: 'Pavol Hejny',
        text: 'yrhtoiho etadgh aradhy ryhdg eahdt rydfhdghrsyfdgh rsydghrsdyfghrtfgh rsdhgrssfhyh rydhfgrtdghryfh rydhdghdthg rhdhyg  rydh eyhdgrstdgh ethrstdhtrty errthryh',
        image: 'https://1.gravatar.com/avatar/3d98c15957c5f5dd227e53dbc7cbb60d?s=300&r=pg&d=mm',
        time: new Date(new Date() / 1 - (1000 * 3600 * 24 * 356 * Math.random()))
    });
}


@observer
export default class Issue extends Component {
    render() {

        const store = this.props.store;

        return (
            <Paper zDepth={0} className="container">
                <h1>Issue #123456</h1>
                <FlatButton
                    label= "Take this issue!"
                    primary={true}
                    backgroundColor="#a4c639"
                    hoverColor="#8AA62F"
                    style={{color: 'white'}}
                    keyboardFocused={true}
                    onClick={()=>{}}
                />
                <List className="list">


                    {events.map((event, index)=>(
                        <div key={index} className="item-container">
                            <ListItem

                                leftAvatar={<Avatar src={event.image}/>}
                                //rightIconButton={rightIconMenu}
                                primaryText={event.author}
                                className={event.type}
                                secondaryText={
                                    <p>
                                        <b>{moment(event.time).fromNow()}</b>
                                        {event.text}
                                        <div className={event.type + '-stamp'}>
                                            {event.type}
                                        </div>
                                    </p>
                                }
                                secondaryTextLines={2}
                            />
                        </div>
                    ))}


                </List>
            </Paper>

        )
    }
}