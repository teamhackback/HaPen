import React, {Component} from 'react';
import {observer} from "mobx-react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Projects from './Projects';
import Timeline from './Timeline';
import Setup from './Setup';
import Project from './Project';
import Issue from './Issue';
import FontIcon from 'material-ui/FontIcon';
import './App.scss';

@observer
class App extends Component {
    render() {


        const store = this.props.store;

        const iconStyles = {
            marginRight: 24,
        };

       return (
            <MuiThemeProvider>
                <div className="App">


                    <AppBar
                        title="HAPEN"
                        style={{color:'black'}}
                        iconElementLeft={<img src="/logo.png" className="logo" alt="HaPen logo"/>}
                        iconElementRight={<div>

                            <FlatButton icon={<i className="fa fa-calendar" aria-hidden="true"></i>} label={`Issues(${store.issue.events.length})`} onClick={()=>store.setCurrentProject(-1)} />
                            <FlatButton icon={<i className="fa fa-list" aria-hidden="true"></i>} label={`Projects(${store.projects.length})`} onClick={()=>store.toggleProjectsBar()} />
                            <FlatButton icon={<i className="fa fa-plus" aria-hidden="true"></i>} label="New Project" onClick={()=>store.createNewProject()} />
							{store.user ? <div>
									Hi, <span>{store.user.name}</span> <a href="https://hapen.hackback.tech/api/user/logout">Logout</a>
								</div>
								: <a href="https://hapen.hackback.tech/api/user/login/github">Login</a>}
                        </div>}
                    />


                    {store.projects_bar?<Projects store={store}/>:undefined}
                    {store.project_new?<Setup store={store}/>:undefined}


                    {store.project_current!==-1?<Project store={store}/>:<Issue store={store}/>}


                </div>
            </MuiThemeProvider>
        )
    }
}

export default App;
