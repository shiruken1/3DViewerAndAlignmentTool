/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';

const Loading = ({ loading, children }) => {
  if (loading) {
    return <Loader active />;
  }
  return children();
};

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired,
};

export default Loading;
