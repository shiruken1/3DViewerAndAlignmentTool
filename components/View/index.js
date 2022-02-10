/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import TopBar from 'components/TopBar';

import css from './View.module.scss';

const View = ({ content, linkFields, menu }) => (
  <div className={css.main}>
    <TopBar viewLinkFields={linkFields} viewMenu={menu} />
    {content}
  </div>
);

View.propTypes = {
  content: PropTypes.node.isRequired,
  linkFields: PropTypes.arrayOf(PropTypes.string.isRequired),
  menu: PropTypes.node,
};

View.defaultProps = {
  linkFields: null,
  menu: null,
};

export default View;
