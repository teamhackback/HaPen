import React, {Component} from 'react';
import {observer} from "mobx-react";
import logo from '../assets/logo.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Projects from './Projects';
import Timeline from './Timeline';
import Setup from './Setup';
import Project from './Project';
import './App.scss';

@observer
class App extends Component {
    render() {


        const store = this.props.store;

       return (
            <MuiThemeProvider>
                <div className="App">


                    <AppBar
                        title="HaPen"
                        iconElementLeft={<img src={logo} className="logo" alt="HaPen logo"/>}
                        iconElementRight={<div>

                            <FlatButton label="Timeline" onClick={()=>store.setCurrentProject(-1)} />
                            <FlatButton label="Projects" onClick={()=>store.toggleProjectsBar()} />
                            <FlatButton label="New Project" onClick={()=>store.createNewProject()} />


                        </div>}
                    />


                    {store.projects_bar?<Projects store={store}/>:undefined}
                    {store.project_new?<Setup store={store}/>:undefined}


                    {store.project_current!==-1?<Project store={store}/>:<Timeline store={store}/>}


                </div>
            </MuiThemeProvider>
        )
    }
}

export default App;
