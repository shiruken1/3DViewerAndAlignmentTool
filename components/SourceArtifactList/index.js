/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */

import Loading from 'components/Loading';

export default class extends React.PureComponent {
  static propTypes = {
    activeArtifactId: PropTypes.string,
    artifacts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    ),
    artifactsLoading: PropTypes.bool.isRequired,
    artifactsLabel: PropTypes.string.isRequired,
    associatedArtifactIds: PropTypes.arrayOf(PropTypes.string.isRequired)
      .isRequired,
    cardComponent: PropTypes.func.isRequired,
    className: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activeArtifactId: null,
    artifacts: null,
    className: null,
  };

  render() {
    const {
      activeArtifactId,
      artifacts,
      artifactsLoading,
      artifactsLabel,
      associatedArtifactIds,
      cardComponent: Card,
      onSelect,
      className,
      ...rest
    } = this.props;
    return (
      <Loading loading={artifactsLoading && !artifacts}>
        {() => (
          <div className={className}>
            {artifacts.map(a => (
              <Card
                active={a.id === activeArtifactId}
                associated={associatedArtifactIds.includes(a.id)}
                key={a.id}
                artifact={a}
                onClick={id => {
                  onSelect(id);
                }}
                {...rest}
              />
            ))}
            {!artifacts.length &&
              `There are no ${artifactsLabel} in this project.`}
          </div>
        )}
      </Loading>
    );
  }
}
