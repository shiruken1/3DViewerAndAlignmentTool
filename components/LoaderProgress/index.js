/* NPM */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Progress, Transition } from 'semantic-ui-react';

import css from './LoaderProgress.module.scss';

class LoaderProgress extends PureComponent {
  static propTypes = {
    progress: PropTypes.number.isRequired,
  };

  render() {
    const { progress } = this.props;
    const isLoading = progress < 100;
    return (
      <Transition animation="fade" duration={4000} visible={isLoading}>
        <Progress
          active={isLoading}
          autoSuccess
          size="tiny"
          total={100}
          value={progress}
        />
      </Transition>
    );
  }
}

class LoaderProgressGroup extends PureComponent {
  static propTypes = {
    items: PropTypes.object.isRequired,
  };
  render() {
    const { items } = this.props;
    return (
      <div className={css.group}>
        {Object.keys(items).map(k => (
          <LoaderProgress key={k} progress={items[k]} />
        ))}
      </div>
    );
  }
}

LoaderProgress.Group = LoaderProgressGroup;

export default LoaderProgress;
