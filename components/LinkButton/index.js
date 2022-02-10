/* NPM */
import withProps from 'recompose/withProps';
import styled from 'react-emotion/macro';

/* App */
const LinkButton = withProps({ type: 'button' })(styled.button`
  border: none;
  color: #1d76bc;
  cursor: pointer;
  text-decoration: underline;
  background-color: transparent;
`);

export default LinkButton;
