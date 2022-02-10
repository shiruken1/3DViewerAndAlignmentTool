import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';
import { Icon as SUIIcon } from 'semantic-ui-react';

import types from './types';
import values from './values';

// wrapper div to set color of contained icons and center them properly
const IconWrapper = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  & i {
    color: ${props => props.theme[props.color]};
    margin-right: 0;
    transition: opacity 0.2s, color 0.2s, transform 0.2s;
    &:hover {
      transform: scale(1.3);
    }
  }
`;
IconWrapper.propTypes = {
  color: PropTypes.string.isRequired,
};

const Icon = ({ onClick, type, value }) => (
  <IconWrapper color={values[value].color} onClick={onClick}>
    <SUIIcon.Group size="large">
      <SUIIcon name={types[type].icon} />
      {types[type].plus ? <SUIIcon corner name="add" /> : null}
    </SUIIcon.Group>
  </IconWrapper>
);
Icon.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(Object.keys(types)).isRequired,
  value: PropTypes.oneOf(Object.keys(values)).isRequired,
};

export default Icon;
