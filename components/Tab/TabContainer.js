import styled, { css } from 'react-emotion/macro';

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${props =>
    props.scrollable &&
    css`
      height: 100%;
    `};
  ${props =>
    !props.scrollable &&
    css`
      flex: 0 0 auto;
    `};
`;

export default TabContainer;
