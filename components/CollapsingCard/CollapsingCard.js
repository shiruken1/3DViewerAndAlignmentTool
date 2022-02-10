/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

/* App */
import Collapse from 'components/Collapse';

import Top from './Top';

const Outer = styled.div`
  background: ${props => (props.associated ? '#fffff5' : '#fff')};
  border: 3px solid ${props => (props.active ? '#a2d7ff' : '#ffffff00')};
  border-radius: 5px;
  box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.33);
  margin: 10px 3px !important;
  &:first-child {
    margin-top: 0 !important;
  }
  &:last-child {
    margin-bottom: 20px !important;
  }
  opacity: ${props => (props.dragging ? 0.5 : 1)};
  padding: 1em 0.5em !important;
`;

const CollapsingCard = ({
  active,
  associated,
  content,
  dragging,
  extra,
  purchased,
  menu,
  name,
  onClick,
  onView,
  perms,
}) => (
  <Outer
    active={active}
    associated={associated}
    dragging={dragging}
    onClick={onClick}>
    <Collapse
      top={
        <Top
          onView={onView}
          perms={perms}
          name={name}
          purchased={purchased}
          menu={menu}
        />
      }
      content={content}
      extra={extra}
    />
  </Outer>
);

CollapsingCard.propTypes = {
  active: PropTypes.bool,
  associated: PropTypes.bool,
  content: PropTypes.node,
  dragging: PropTypes.bool,
  extra: PropTypes.node.isRequired,
  purchased: PropTypes.bool,
  menu: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onView: PropTypes.func,
  perms: PropTypes.object.isRequired,
};

CollapsingCard.defaultProps = {
  active: false,
  associated: false,
  content: null,
  dragging: false,
  onView: null,
  purchased: false,
};

export default CollapsingCard;
