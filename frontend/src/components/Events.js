import React, {Component} from 'react';
const markdown = require('markdown').markdown;
const moment = require('moment');
import superagent from 'superagent';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {
  BugIcon,
  CheckIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitMergeIcon,
  GitPullRequestIcon,
  ThumbsupIcon,
} from 'react-octicons-svg';
import FontIcon from 'material-ui/FontIcon';
import './styles/Events.scss';

const iconSize = {width: "40px", height: "40px"};

function Action({data}){
  let image = '';
  let title = '';
  switch(data.action) {
    case 'opened':
    title = `Issue ${data.action} by ${data.issue.user.login}`;
      image = <GitBranchIcon style={iconSize}/>;
      break;
    case 'closed':
      title = `Issue ${data.action}. You made €20!`;
      image = <GitMergeIcon style={iconSize}/>
      break;
  }
  return (
    <Card>
        <CardHeader
              title={title}
              subtitle={moment(data.issue.created_at).fromNow()}
              avatar={image}
          />
    </Card>
  );
}

function PullRequest({data}){
  let image = '';
  switch(data.blob.action) {
    case 'opened':
      image = <GitBranchIcon style={iconSize}/>
      break;
    case 'closed':
      image = <GitPullRequestIcon style={iconSize}/>
      break;
    case 'submitted':
      image = <GitCommitIcon style={iconSize}/>
      break;
  }
  console.log(data);
  return (
    <Card>
        <CardHeader
            title = {`Pull request ${data.blob.action} by ${data.blob.sender.login}`}
            subtitle={moment(data.blob.insertedAt).fromNow()}
            avatar={image}
          />
    </Card>
  );
}


export default class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      avatarUrl: "",
      blob: {
        "body": ""
      }
    };

    const [aid] = window.location.href.split("/").slice(-1);
    this.aid = aid;

    setInterval(this.refresh, 200);
  }
  
  componentDidMount() {
    // TODO: reduce me to 100
    this.timerID = setInterval(
      () => this.refresh(),
      200
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  refresh = () => {
    superagent
      .get(`https://hapen.hackback.tech/api/issues/${this.aid}`)
      .end((err, res) => {
        if (!(err || !res.ok)) {
          this.setState({
            "events": res.body.events || [],
            "blob": res.body.blob,
            "avatarUrl": res.body.blob.user.avatar_url,
            "taken": res.body.takenAt
          });
        }
      });
  };
  claim = () => {
    superagent
      .get(`https://hapen.hackback.tech/api/issues/${this.aid}/take`)
      .end((err, res) => {
        console.log(res);
      });
  };

  render() {
    const assigneeBlock =
        <CardActions>
          <div>
            { this.state.taken ?
            <RaisedButton
              className="awesome-button-wrapper"
              label="Claimed"
              primary={true}
              disabled={true}
              icon={<FontIcon className="material-icons">motorcycle</FontIcon>}
            />

                :
            <RaisedButton
              className="awesome-button-wrapper"
              label="Claim"
              onClick={this.claim}
              primary={true}
              icon={<FontIcon className="material-icons">motorcycle</FontIcon>}
            />
              }
          </div>
      </CardActions>
    return (
      <div className="events-wrapper">
        {
          this.state.blob &&
          (<Card>
            <CardHeader
              title={`Issue ${this.state.blob.number} - ${this.state.blob.title}`}
              subtitle={moment(this.state.blob.created_at).fromNow()}
              avatar={this.state.avatarUrl}
            />
            {assigneeBlock}
            <CardText>
              { this.state.blob.body  &&
              <div className="markdown-wrapper" dangerouslySetInnerHTML={{ __html: markdown.toHTML(this.state.blob.body) }} />
              }
            </CardText>
          </Card>)
        }
        {this.state.events.map((item, index) =>
          <div key={index}>
            {item.action ? <Action data={item} /> : <PullRequest data={item} />}
          </div>
        )}
      </div>
    );
  }
};
