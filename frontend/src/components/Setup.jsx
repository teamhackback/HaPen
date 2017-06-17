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
import AutoComplete from 'material-ui/AutoComplete';
import {PROJECT_TYPES,PROJECT_LANGUAGES} from '../config';

@observer
export default class Setup extends Component {
    render() {

        const store = this.props.store;

        let stepContent, cantGoNext;


        if (store.step_current === 0) {
            cantGoNext = !store.currentProject.name;//todo better
            stepContent = (
                <TextField
                    floatingLabelText="Project name"
                    defaultValue={store.currentProject.name}
                    onChange={(event, value)=>store.setCurrentProjectKey('name', value)}
                />
            );
        } else if (store.step_current === 1) {
            cantGoNext = !store.currentProject.type;//todo better
            stepContent = (

                <AutoComplete
                    dataSource={PROJECT_TYPES}
                    floatingLabelText="Project type"
                    defaultValue={store.currentProject.type}
                    onUpdateInput={(event, value)=>store.setCurrentProjectKey('type', value)}
                />
            );
        } else if (store.step_current === 2) {
            cantGoNext = !store.currentProject.language;//todo better
            stepContent = (


                <AutoComplete
                    dataSource={PROJECT_LANGUAGES}
                    floatingLabelText="Project language"
                    defaultValue={store.currentProject.language}
                    onUpdateInput={(event, value)=>store.setCurrentProjectKey('language', value)}
                />
            );
        }


        /*
         <SelectField
         floatingLabelText="Language"
         value={0}
         onChange={()=> {
         }}
         >

         {['JavaScript', 'TypeScript'].map((language, index)=>(
         <MenuItem key={index} value={index} primaryText={language}/>
         ))}
         </SelectField>
        * */


        const actions = [
            <FlatButton
                label="Cancel"
                primary={false}
                onClick={()=>console.log('tapped!')}
            />,
            <FlatButton
                label="Previous"
                disabled={store.step_current === 0}
                primary={false}
                onClick={()=>store.previousStep()}
            />,
            <FlatButton
                label={store.step_current === 2 ? "Create project!" : "Next"}
                disabled={cantGoNext}
                primary={true}
                backgroundColor={cantGoNext ? '#999' : "#a4c639"}
                hoverColor="#8AA62F"
                style={{color: 'white'}}
                keyboardFocused={true}
                onClick={()=>store.step_current === 2 ?store.setCurrentProject(-1):store.nextStep()/*todo why thare is working onClick not onTouchTap???*/}
            />,
        ];


        return (
            <Dialog
                title={`Start a new project ${store.currentProject.name || ''}!`}
                actions={actions}
                modal={false}
                open={true}
                onRequestClose={this.handleClose}
            >


                <Stepper activeStep={store.step_current}>
                    <Step>
                        <StepLabel>Select project name</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Select project type</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Select project language</StepLabel>
                    </Step>
                </Stepper>

                {stepContent}

            </Dialog>

        )
    }
}