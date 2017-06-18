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


import superagent from 'superagent';
import superagentPromise from 'superagent-promise';
var agent = superagentPromise(superagent, Promise);



/*let events = [];

for (let i = 100; i > 0; i--) {
    events.push({
        type: Math.random() > 0.95 ? 'APPROVED' : 'NORMAL',
        author: 'Pavol Hejny',
        text: 'yrhtoiho etadgh aradhy ryhdg eahdt rydfhdghrsyfdgh rsydghrsdyfghrtfgh rsdhgrssfhyh rydhfgrtdghryfh rydhdghdthg rhdhyg  rydh eyhdgrstdgh ethrstdhtrty errthryh',
        image: 'https://1.gravatar.com/avatar/3d98c15957c5f5dd227e53dbc7cbb60d?s=300&r=pg&d=mm',
        time: new Date(new Date() / 1 - (1000 * 3600 * 24 * 356 * Math.random()))
    });
}*/







@observer
export default class Issue extends Component {
    render() {

        const store = this.props.store;
        console.log(store.events);

        return (
            <Paper zDepth={0} className="container">
                <h1>Issue #{store.issue._id}</h1>
                <FlatButton
                    label= "Take this issue!"
                    primary={true}
                    backgroundColor="#a4c639"
                    hoverColor="#8AA62F"
                    style={{color: 'white'}}
                    keyboardFocused={true}
                    onClick={()=>{
                        agent('PUT',`https://hapen.hackback.tech/api/issues/${store.issue._id}/take`).then(()=>{
                            alert('It is yours!');
                        })

                    }}
                />
                <List className="list">


                    {store.issue.events.map((event, index)=>(
                        <div key={index} className="item-container">
                            <ListItem

                                leftAvatar={<Avatar src={'https://1.gravatar.com/avatar/3d98c15957c5f5dd227e53dbc7cbb60d?s=300&r=pg&d=mm'}/>}
                                //rightIconButton={rightIconMenu}
                                primaryText={event.author}
                                className={event.issue.state==='open'?'APPROVED':'NORMAL'}
                                secondaryText={
                                    <p>
                                        <b>{moment(event.issue.created_at).fromNow()}</b>
                                        {event.issue.title}
                                        <div className={(event.issue.state==='open'?'APPROVED':'NORMAL') + '-stamp'}
                                        style={{
                                            transform: event.issue.state==='open'?`rotate(${Math.ceil(Math.random()*360)}deg)`:undefined
                                        }}

                                        >
                                            {event.issue.state==='open'?'APPROVED':'NORMAL'}
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