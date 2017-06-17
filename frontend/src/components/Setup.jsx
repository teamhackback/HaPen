import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
    Step,
    Stepper,
    StepLabel,
} from 'material-ui/Stepper';
import Dialog from 'material-ui/Dialog';


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


                    </Dialog>

        )
    }
}