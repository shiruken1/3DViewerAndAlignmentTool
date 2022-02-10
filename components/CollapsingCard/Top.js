/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

/* App */
import Button from 'components/Button';

const HeaderGroup = styled.div`
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
`;

const HeaderTitle = styled.span`
  color: #464646;
  flex: 1 1 auto;
  font-size: 16px
  font-weight: 300;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  &:hover {
    overflow: visible;
    white-space: normal;
  }
`;

const ViewButton = styled(Button)`
  margin: -4px 20px 0 20px;
`;

const Top = ({ menu, name, onView }) => (
  <HeaderGroup>
    <HeaderTitle>{name}</HeaderTitle>
    {onView && (
      <ViewButton primary onClick={onView}>
        View
      </ViewButton>
    )}
    {menu}
  </HeaderGroup>
);

Top.propTypes = {
  menu: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  onView: PropTypes.func,
};

Top.defaultProps = {
  onView: null,
};

export default Top;
