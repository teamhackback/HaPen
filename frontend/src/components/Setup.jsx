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

@observer
export default class Setup extends Component {
    render() {

        const store = this.props.store;

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={()=>store.nextStep()}
            />,
        ];


        return (
                    <Dialog
                        title="Start a new project!"
                        actions={actions}
                        modal={false}
                        open={true}
                        onRequestClose={this.handleClose}
                    >


                        <Stepper activeStep={store.step}>
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




                        <TextField
                            floatingLabelText="Project name"
                            onChange={(event,value)=>store.setCurrentProjectName(value)}
                        />


                        <SelectField
                            floatingLabelText="Frequency"
                            value={0}
                            onChange={()=>{}}
                        >

                            {['Web app', 'Mobile app'].map((area,index)=>(
                                <MenuItem key={index} value={index} primaryText={area} />
                            ))}
                        </SelectField>



                    </Dialog>

        )
    }
}