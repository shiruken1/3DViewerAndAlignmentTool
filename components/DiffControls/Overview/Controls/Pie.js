import React from 'react';
import PropTypes from 'prop-types';

import styled, { css } from 'react-emotion/macro';

const Slice = styled.div`
  position: absolute;
  width: 50%;
  height: 100%;
  overflow: hidden;
  left: 50%;
  transform-origin: left center;
  transform: rotate(${props => `${props.start}deg`});

  // the part that is actually visible
  &::before {
    content: '';
    position: absolute;
    width: ${props => props.size / 2}px;
    height: ${props => props.size}px;
    left: -${props => props.size / 2}px;
    border-radius: ${props => props.size / 2}px 0 0 ${props => props.size / 2}px;
    transform-origin: right center;
    transform: rotate(${props => `${parseFloat(props.value)}deg`});
    background-color: ${props => props.color};
  }

  // a slice bigger than half the pie is handled differently
  ${props =>
    props.value > 180 &&
    css`
      width: ${props.size}px;
      left: 0;
      transform-origin: center center;
      &::before {
        width: ${props.size / 2}px;
        left: 0px;
      }
      &::after {
        background-color: ${props.color};
        content: '';
        position: absolute;
        width: ${props.size / 2}px;
        height: ${props.size}px;
        left: ${props.size / 2}px;
        border-radius: 0 ${props.size / 2}px ${props.size / 2}px 0;
      }
    `};
`;

const Container = styled.div`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  position: relative;
`;

const Pie = ({ data, size }) => {
  // convert raw # per slice to degrees
  const sum = data.reduce((a, d) => a + d.value, 0);
  if (!sum) {
    return <Container size={size} />;
  }
  let start = 0;
  const slices = data.map(d => {
    const sliceStart = start;
    start += d.value;
    return {
      start: (sliceStart * 360) / sum,
      value: (d.value * 360) / sum,
      color: d.color,
      size,
    };
  });
  return (
    <Container size={size}>
      {slices.map(s => (
        <Slice
          color={s.color}
          key={s.color}
          size={size}
          start={s.start}
          value={s.value}
        />
      ))}
    </Container>
  );
};

Pie.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  size: PropTypes.number.isRequired,
};

export default Pie;
