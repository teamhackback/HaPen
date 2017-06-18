import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import superagent from 'superagent';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {throttle} from 'lodash';
const markdown = require('markdown').markdown;
const moment = require('moment');

export class SearchResult extends Component {
  render() {
    return (
      <div>
          {this.props.items.map((item,index)=>(
            <Card key={item.aid}>
              <CardHeader
                title={`Issue ${item.blob.number} - ${item.blob.title}`}
                subtitle={moment(item.blob.created_at).fromNow()}
                avatar={item.blob.user.avatar_url}
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardActions>
                <FlatButton label="Take" />
              </CardActions>
              <CardText expandable={true}>
                <div dangerouslySetInnerHTML={{__html: markdown.toHTML(item.blob.body)}}>
                </div>
              </CardText>
            </Card>
          ))}
      </div>
    );
  }
};
export default class Search extends Component {
	state = {
		items: []
	}
  constructor() {
    super();
    this.apiSearch = throttle((val) => {
      const filter = !!val ? `?search=${val}` : "";
      superagent
        .get(`https://hapen.hackback.tech/api/issues${filter}`)
        .end((err, res) => {
          if (!(err || !res.ok)) {
            this.setState({items: res.body});
          }
        });
      }, 100);
    this.apiSearch();
  }
  onSearch = (_, val) => {
    this.apiSearch(val);
  };
  render() {
    return (
      <div>
        <TextField
          onChange={this.onSearch}
          defaultValue=""
          floatingLabelText="Search"
          fullWidth={true}
        />
        <SearchResult items={this.state.items} />
      </div>
    );
  }
}
