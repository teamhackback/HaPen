import React from 'react';
import {
	withRouter,
    Redirect,
} from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextLogo from '../../public/text-logo.svg';
import SquareLogo from '../../public/square-logo.svg';
import RaisedButton from 'material-ui/RaisedButton';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import FontIcon from 'material-ui/FontIcon';
import './styles/Home.scss';

export class Home extends React.Component {
  componentWillMount() {
  	if(window.SESSION_USER) {
		this.props.history.push("/search")
	}
  }
  render() {
  return (
    <div className="home">
        <Paper className="paper" style={{textAlign:'center'}} zDepth={0}>
            <img src={SquareLogo} style={{width: 200,marginTop:30,borderRadius:500,padding:3,boxShadow:'black 0 0 3px'}}/>
            <h1>/haPen</h1>
            <h2>Everybody <span style={{color:'#999'}}>{'/.*/g'}</span> <span style={{color:'red'}}>♥</span> OpenSource</h2>


            <RaisedButton
              label="Connect with GitHub"
              primary={true}
              style={{ margin: 12 }}
              icon={<i className="fa fa-github" aria-hidden="true"></i>}
              href='https://hapen.hackback.tech/api/user/login/github'
            />

            <p>
              Matching passionate developers with super-cool open source projects!
            </p>
        </Paper>


  </div>
    )
  }
};
export default withRouter(Home);
