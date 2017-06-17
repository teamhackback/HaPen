import React, {Component} from 'react';
import {observer} from 'mobx-react';
import logo from '../assets/logo.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Setup from './Setup';
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
                        iconElementRight={<FlatButton label="Login" />}
                    />

                    <Setup store={store}/>


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
