/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

/* App */

import css from './Collapse.module.scss';

export default class extends React.PureComponent {
  static propTypes = {
    content: PropTypes.node,
    extra: PropTypes.node.isRequired,
    top: PropTypes.node.isRequired,
  };

  static defaultProps = {
    content: null,
  };

  state = {
    open: false,
  };

  render() {
    const { content, extra, top } = this.props;
    const { open } = this.state;
    return (
      <div className={css.main}>
        <div className={css.top}>
          <Icon
            className={css.icon}
            name={open ? 'chevron up' : 'chevron down'}
            onClick={() => {
              this.setState(prevState => ({ open: !prevState.open }));
            }}
          />
          {top}
        </div>
        {content}
        {open && <div className={css.extra}>{extra}</div>}
      </div>
    );
  }
}
