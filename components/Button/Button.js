import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

const Button = styled.button`
  background-color: ${props => {
    if (props.primary) return props.theme.primaryBackground;
    if (props.tertiary) return props.theme.tertiaryBackground;
    return props.theme.secondaryBackground;
  }};
  border: ${props => (props.hollow ? '1px solid' : 'none')};
  border-radius: 3px;
  color: ${props => {
    if (props.disabled) return props.theme.disabledColor;
    if (props.primary) return props.theme.primaryColor;
    if (props.tertiary) return props.theme.tertiaryColor;
    return props.theme.secondaryColor;
  }};
  font-size: 14px;
  font-weight: 400; // normal
  height: 28px;
  padding: 2px 9px 2px 9px;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
`;

Button.propTypes = {
  disabled: PropTypes.bool,
  hollow: PropTypes.bool,
  primary: PropTypes.bool,
  role: PropTypes.string,
  tertiary: PropTypes.bool,
};

Button.defaultProps = {
  disabled: false,
  hollow: false,
  primary: false,
  role: 'button',
  tertiary: false,
};

/** @component */
export default Button;
