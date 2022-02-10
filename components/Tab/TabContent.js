import styled, { css } from 'react-emotion/macro';

const TabContent = styled.div`
  background: white;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 0 5px;
  ${props =>
    props.scrollable &&
    css`
      height: 0;
      overflow-y: auto;
    `};
`;

export default TabContent;
