import React, {Component} from 'react';
//import logo from '../assets/logo.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import {
    Step,
    Stepper,
    StepLabel,
} from 'material-ui/Stepper';
import Dialog from 'material-ui/Dialog';


import './App.scss';

class App extends Component {
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
            <MuiThemeProvider>
                <div className="App">


                    <AppBar title="HaPen"/>


                    <Dialog
                        title="Dialog With Actions"
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


                    {/*<nav className="top">
                     <img src={logo} className="logo" alt="HaPen logo"/>
                     <h1 className="App-title"> HaPen </h1>
                     <div className="App-subtitle"> Base for opensource</div>
                     </nav>*/}


                    {/*<main>
                     <div className="window">

                     <h2 className="title">Start a new project</h2>

                     <div className="content">

                     Project name:
                     <input type="text"/>

                     Select your language:
                     <select>
                     {['JavaScript', 'TypeScript'].map((language)=>(
                     <option key={language}>{language}</option>
                     ))}
                     </select>

                     Select project area:
                     <select>cd frontend

                     {['Web app', 'Mobile app'].map((area)=>(
                     <option key={area}>{area}</option>
                     ))}
                     </select>



                     <RaisedButton label="Submit" />


                     </div>


                     </div>
                     </main>*/}


                </div>
            </MuiThemeProvider>
        )
    }
}

export default App;
