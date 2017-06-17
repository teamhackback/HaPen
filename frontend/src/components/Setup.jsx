import React, {Component} from 'react';
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


export default class Setup extends Component {
    render() {

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
                onTouchTap={this.handleClose}
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


                        <Stepper activeStep={0}>
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