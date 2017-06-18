import React from 'react';
import {
  Redirect,
} from 'react-router-dom';

const Home = () => (
  <Redirect to={{
    pathname: '/search'
  }} />
);

export default Home;
