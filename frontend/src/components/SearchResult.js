import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import superagent from 'superagent';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {throttle} from 'lodash';
const markdown = require('markdown').markdown;
const moment = require('moment');
import './styles/Search.scss';
import PropTypes from 'prop-types';

function makeSlug(url)
{
  return url.split("/").slice(-2).join("/");
}

export class SearchResult extends Component {
  render() {
    return (
      <div>
          {this.props.items.map((item,index)=>(
            <Link to={`/issue/${item.aid}`} key={item.aid} >
              <Card expandable={false} className="animated slideInUp">
                <CardHeader
                  title={`Issue ${item.blob.number} - ${item.blob.title}`}
                  subtitle={`${makeSlug(item.blob.repository_url)} - ${moment(item.blob.created_at).fromNow()}`}
                  avatar={item.blob.user.avatar_url}
                />
              </Card>
            </Link>
          ))}
      </div>
    );
  }
};

class Search extends Component {
  state = {
    items: []
  }
  constructor() {
    super();
    this.lastVal = "";
    this.apiSearch = throttle((val) => {
      this.lastVal = val;
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

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.apiSearch(this.lastVal);
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  onSearch = (_, val) => {
    this.apiSearch(val);
  };
  render() {
    return (
      <div className="search-wrapper">
        <TextField
          className="search-input"
          onChange={this.onSearch}
          defaultValue=""
          floatingLabelText="Search for issues"
          fullWidth={true}
        />
        <SearchResult items={this.state.items} />
      </div>
    );
  }
}

Search.contextTypes = {
  router: PropTypes.object
};

export default Search;
