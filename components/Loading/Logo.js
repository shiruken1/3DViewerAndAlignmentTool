/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({ loading }) => {
  if (loading) {
    return (
      <img
        style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1 }}
        src="/skur_spinner.svg"
        alt="Loading..."
      />
    );
  }

  return null;
};

Logo.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default Logo;
