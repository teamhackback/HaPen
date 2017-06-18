import React from 'react';
import {
    Redirect,
} from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextLogo from '../../public/text-logo.svg';
import RaisedButton from 'material-ui/RaisedButton';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import FontIcon from 'material-ui/FontIcon';
import './styles/Home.scss';



const Home = () => (
    <div className="home">
        <Paper style={{textAlign:'center'}} zDepth={0}>

            <h1><img src={TextLogo} style={{width: 300}}/></h1>
            <h2>Everybody <span style={{color:'#999'}}>{'/.*/g'}</span> <span style={{color:'red'}}>♥</span> OpenSource</h2>


            <RaisedButton
                label="Connect with GitHub"
                secondary={true}
                style={{margin: 12}}
                icon={<i className="fa fa-github" aria-hidden="true"></i>}
                onClick={()=>window.location.assign('https://hapen.hackback.tech/api/user/login/github')}
            />


            <p>
                Donations usually go to foundations and famous projects<br/>
                Smaller, less known projects are <b>nowhere</b> in sight
            </p>

            <p>
                We want to <b>increase</b><br/>
                the <b>impact</b> of these donations

            </p>





        </Paper>


    </div>
);

export default Home;
