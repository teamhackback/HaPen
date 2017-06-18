import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';
import { observer } from 'mobx-react';

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}


const PrivateRoute = observer(({ component, redirectTo, store, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return store.user ? (
        renderMergedProps(component, routeProps, store, rest)
      ) : (
          <Redirect to={{
            pathname: redirectTo,
            state: { from: routeProps.location }
          }} />
        );
    }} />
  );
});

export default PrivateRoute;
