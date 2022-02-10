/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import withProps from 'recompose/withProps';
import styled from 'react-emotion/macro';

const color = {
  background: '#ffffff',
  border: '#777777',
  checked: '#464646',
  focused: '#3b99fc',
  disabled: '#b4b4b4',
};

const Container = styled.div`
  margin: 0.5rem;
`;
const Button = withProps({ type: 'radio' })(styled.input`
  position: absolute;
  opacity: 0;
  }
`);
const Label = styled.label`
  &::before {
    content: '';
    background-color: ${color.background};
    border-radius: 100%;
    border: 2px solid ${color.border};
    display: inline-block;
    width: 1.4em;
    height: 1.4em;
    position: relative;
    top: -0.2em;
    margin-right: 1em;
    vertical-align: top;
    cursor: pointer;
    text-align: center;
    transition: all 250ms ease;
  }
  &::before {
    input:checked + & {
      background-color: ${color.checked};
      box-shadow: inset 0 0 0 4px ${color.background};
    }
    input:focus + & {
      outline: none;
      border-color: ${color.focused};
    }
    input:disabled + & {
      box-shadow: inset 0 0 0 4px ${color.background};
      border-color: ${color.disabled};
      background: ${color.disabled};
    }
  }
  &:empty {
    &:before {
      margin-right: 0;
    }
  }
`;

// autogenerate ids in order to use htmlFor on label without requiring
// caller to supply an id for an internal element
let nextId = 0;
function makeId() {
  nextId += 1;
  return `RadioButton-${nextId}`;
}

const RadioButton = ({ checked, disabled, label, onCheck }) => {
  const id = makeId();
  return (
    <Container>
      <Button
        checked={checked}
        disabled={disabled}
        id={id}
        onChange={onCheck}
      />
      <Label htmlFor={id}>{label}</Label>
    </Container>
  );
};
RadioButton.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onCheck: PropTypes.func.isRequired,
};
RadioButton.defaultProps = {
  checked: false,
  disabled: false,
};

export default RadioButton;

/* for testing only

export class Test extends React.Component {
  state = { choice: 'a' };
  render() {
    return (
      <div>
        <RadioButton
          label="test"
          checked={this.state.choice === 'a'}
          onCheck={() => this.setState({ choice: 'a' })}
        />
        <RadioButton
          label="test"
          checked={this.state.choice === 'b'}
          onCheck={() => this.setState({ choice: 'b' })}
        />
        <RadioButton
          disabled
          label="test"
          checked={this.state.choice === 'c'}
          onCheck={() => this.setState({ choice: 'c' })}
        />
      </div>
    );
  }
}

*/
