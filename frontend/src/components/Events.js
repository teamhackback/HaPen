import React, {Component} from 'react';
const markdown = require('markdown').markdown;
const moment = require('moment');
import superagent from 'superagent';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {
  BugIcon,
  CheckIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitMergeIcon,
  GitPullRequestIcon,
  ThumbsupIcon,
} from 'react-octicons-svg';

const iconSize = {width: "40px", height: "40px"};

function Action({data}){
  return (
    <Card>
        <CardHeader
              title={`Action: ${data.action}`}
              subtitle={"foo"}
          />
          <BugIcon style={iconSize}/>
          <GitBranchIcon style={iconSize}/>
          <GitCommitIcon style={iconSize}/>
          <ThumbsupIcon style={iconSize}/>
    </Card>
  );
}

function PullRequest({data}){
  return (
    <Card>
        <CardHeader
              title={`PullRequest: ${data.blob.action}`}
              subtitle={"foo"}
          />
          <CheckIcon style={iconSize}/>
          <GitMergeIcon style={iconSize}/>
          <GitPullRequestIcon style={iconSize}/>
    </Card>
  );
}


export default class Events extends Component {
	state = {
		events: [],
    blob: {
      "body": ""
    }
	}
  constructor() {
    super();
      const [aid] = window.location.href.split("/").slice(-1);
      this.aid = aid;
      this.refresh();
      setInterval(this.refresh, 200);
    // TODO: reduce me to 100
  }
  refresh = () => {
      superagent
      .get(`https://hapen.hackback.tech/api/issues/${this.aid}`)
        .end((err, res) => {
          if (!(err || !res.ok)) {
            this.setState({"events": res.body.events, "blob": res.body.blob});
          }
        });
  };
  render() {
    return (
      <div>
        { this.state.blob.assignee
            ? <div> Assigned to {this.state.blog.assignee} </div>
            : <FlatButton label="Take" />
        }
        <div>
          <div dangerouslySetInnerHTML={{__html: markdown.toHTML(this.state.blob.body)}} />
        </div>
      { this.state.events.map((item, index) =>
        <div key={index} className="animated bounceInUp">
          {item.action ? <Action data={item} /> : <PullRequest data={item} /> }
        </div>
      )}
      </div>
    );
  }
};
