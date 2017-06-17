import React, {Component} from 'react';
import logo from '../assets/logo.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';


import './App.scss';

class App extends Component {
    render() {
        return (
            <MuiThemeProvider>
                <div className="App">

                    <nav className="top">
                        <img src={logo} className="logo" alt="HaPen logo"/>
                        <h1 className="App-title"> HaPen </h1>
                        <div className="App-subtitle"> Base for opensource</div>
                    </nav>

                    <main>
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
                    </main>


                    <footer>
                        Made on HackPrague
                    </footer>

                </div>
            </MuiThemeProvider>
        )
    }
}

export default App;
