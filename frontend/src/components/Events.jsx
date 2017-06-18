import React, {Component} from 'react';
const markdown = require('markdown').markdown;
const moment = require('moment');
import superagent from 'superagent';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { Paper } from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import './styles/Events.scss';

function Action({data}){
  return (
    <Card>
        <CardHeader
              title={`Action: ${data.action}`}
              subtitle={"foo"}
          />
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
    </Card>
  );
}

export default class Events extends Component {

  constructor(props) {
    super(props);
    this.state = {
      events: [],
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
          this.setState({ "events": res.body.events, "blob": res.body.blob });
        }
      });
  }

  render() {
    console.log(this.state.blob);
    return (
      <div className="events-wrapper">
        <Card>
          {this.state.blob.assignee
            ? <div> Assigned to {this.state.blog.assignee} </div>
            : <FlatButton label="Take" />
          }
          <div>
            <div dangerouslySetInnerHTML={{ __html: markdown.toHTML(this.state.blob.body) }} />
          </div>
          {this.state.events.map((item, index) =>
            <div key={index}>
              {item.action ? <Action data={item} /> : <PullRequest data={item} />}
            </div>
          )}
        </Card>
      </div>
    );
  }
};