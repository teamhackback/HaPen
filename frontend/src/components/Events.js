import React, {Component} from 'react';
const markdown = require('markdown').markdown;
const moment = require('moment');
import superagent from 'superagent';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

function Action({data}){
  return (
    <Card>
        <CardHeader
              title={`Issue`}
              subtitle={"foo"}
          />
    </Card>
  );
}

function PullRequest(){
  return (
    <Card>
        <CardHeader
              title={`PullRequest`}
              subtitle={"foo"}
          />
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
      superagent
      .get(`https://hapen.hackback.tech/api/issues/${aid}`)
        .end((err, res) => {
          if (!(err || !res.ok)) {
            this.setState({"events": res.body.events, "blob": res.body.blob});
            console.log(res.body);
          }
        });
  }
  render() {
    return (
      <div>
        <FlatButton label="Take" />
        <div>
          <div dangerouslySetInnerHTML={{__html: markdown.toHTML(this.state.blob.body)}} />
        </div>
      { this.state.events.map((item, index) =>
        <div key={index}>
          {item.action ? <Action data={item} /> : <PullRequest data={item} /> }
        </div>
      )}
      </div>
    );
  }
};
