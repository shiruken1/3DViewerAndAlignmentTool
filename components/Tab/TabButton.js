import styled from 'react-emotion/macro';
import PropTypes from 'prop-types';

const TabButton = styled.button`
  background: ${props => (props.active ? '#1d76bc' : '#b9b9b9')};
  border: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  color: white;
  cursor: ${props => (props.disabled ? 'auto' : 'pointer')};
  font-size: ${props => (props.large ? '24px' : '16px')};
  font-weight: ${props => (props.large ? '300' : 'normal')};
  margin: 0 ${props => (props.large ? '5px' : '2px')};
  margin-top: ${props => (props.large ? '0' : '10px')};
  &:first-child {
    margin-left: ${props => (props.large ? '10px' : '15px')};
  }
  &:last-child {
    margin-right: ${props => (props.large ? '10px' : '15px')};
  }
  padding-top: ${props => (props.large ? '32px' : '12px')};
  text-align: left;
  vertical-align: baseline;
  width: 100%;

  &:hover {
    background: ${props => (props.active ? '#18629a' : '#a6a6a6')};
  }
`;

TabButton.propTypes = {
  active: PropTypes.bool,
  large: PropTypes.bool,
};

TabButton.defaultProps = {
  active: false,
  large: false,
};

export default TabButton;
