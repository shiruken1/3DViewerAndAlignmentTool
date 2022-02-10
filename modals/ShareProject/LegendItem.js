import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

import values from './values';

const LegendItemDecoration = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  margin-right: 20px;
  padding-bottom: 3px;

  &::before {
    background-color: ${props => props.theme[values[props.value].color]};
    border-radius: 7.5px;
    color: ${props => props.theme.subHeaderColor};
    content: '';
    display: inline-block;
    height: 15px;
    margin-bottom: -3px;
    margin-right: 8px;
    width: 15px;
  }
`;

const LegendItem = ({ value }) => (
  <LegendItemDecoration value={value}>
    {values[value].label}
  </LegendItemDecoration>
);
LegendItem.propTypes = {
  value: PropTypes.oneOf(Object.keys(values)).isRequired,
};

/** @component */
export default LegendItem;
