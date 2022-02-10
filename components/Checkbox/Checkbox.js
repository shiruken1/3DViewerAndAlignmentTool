import React from 'react';
import PropTypes from 'prop-types';
import withProps from 'recompose/withProps';
import styled, { css } from 'react-emotion/macro';

const Container = styled.div`
  label: Container;

  box-sizing: border-box;
  font-size: 12px;
  line-height: 24px;
`;

const Input = withProps({ type: 'checkbox' })(styled.input`
  label: Input;

  opacity: 0;
  position: absolute;
`);

const Checkmark = styled.label`
  label: Checkmark;

  color: #777777;
  display: inline-block;
  height: 24px; // ensure label doesn't collapse if content is empty
  margin-left: ${props => (props.label ? '5px' : '0px')};
  padding-right: 27px;
  position: relative;

  &::before,
  &::after {
    background-color: #eaeaea;
    content: '';
    cursor: pointer;
    display: inline-block;
    position: absolute;
  }

  /* draw outer box */
  &::before {
    border: 3px solid ${props => props.color};
    border-radius: 5px;
    height: 22px;
    right: 0px;
    top: 0px;
    width: 22px;
  }

  ${Container}:focus-within &::before {
    outline: rgb(59, 153, 252) auto 5px !important;
  }

  /* draw fake checkmark by rotating L shape */
  ${props =>
    props.checked &&
    css`
      &::after {
        border-bottom: 2px solid #464646;
        border-left: 2px solid #464646;
        height: 6px;
        right: 6px;
        top: 7px;
        transform: rotate(-45deg);
        width: 11px;
      }
    `};

  ${props =>
    !props.checked &&
    css`
      &::after {
        border-bottom: 2px solid;
        height: 0px;
        right: 6px;
        top: 11px;
        width: 9px;
      }
    `};
`;

// autogenerate ids in order to use htmlFor on label without requiring
// caller to supply an id for an internal element
let nextId = 0;
function makeId() {
  nextId += 1;
  return `Checkbox-${nextId}`;
}

const Checkbox = ({ checked, color, label, onChange }) => {
  const id = makeId();
  return (
    <Container>
      <Checkmark checked={checked} htmlFor={id} label={label} color={color}>
        {label}
      </Checkmark>
      <Input
        checked={checked}
        id={id}
        onChange={e => {
          if (onChange) {
            onChange(e.target.checked);
          }
        }}
      />
    </Container>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  color: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  checked: false,
  color: '#000',
  label: '',
  onChange: null,
};

export default Checkbox;
