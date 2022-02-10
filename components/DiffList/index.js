/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import Loading from 'components/Loading';
import DiffCard from 'components/DiffCard';

export default class extends React.PureComponent {
  static propTypes = {
    activeDiffId: PropTypes.string,
    perms: PropTypes.object.isRequired,
    associatedDiffIds: PropTypes.arrayOf(PropTypes.string.isRequired)
      .isRequired,
    className: PropTypes.string,
    diffs: PropTypes.arrayOf(PropTypes.object.isRequired),
    loading: PropTypes.bool.isRequired,
    onSelectDiff: PropTypes.func.isRequired,
    onSetThumb: PropTypes.func.isRequired,
    onViewDiff: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    onItemInfo: PropTypes.func.isRequired,
  };
  static defaultProps = {
    activeDiffId: null,
    className: null,
    diffs: null,
  };
  render() {
    const {
      activeDiffId,
      associatedDiffIds,
      className,
      diffs,
      loading,
      onSelectDiff,
      onSetThumb,
      onViewDiff,
      onDeleteItem,
      onEditItem,
      onItemInfo,
      perms,
    } = this.props;

    return (
      <Loading loading={loading && !diffs}>
        {() => (
          <div className={className}>
            {diffs.filter(d => d.purchased).map(d => (
              <DiffCard
                active={d.id === activeDiffId}
                activities={d.activities}
                perms={perms}
                associated={associatedDiffIds.includes(d.id)}
                key={d.id}
                diff={d}
                onClick={() => {
                  onSelectDiff(d.id);
                }}
                onClickThumb={() => {
                  onSetThumb(d.id);
                }}
                onDeleteItem={onDeleteItem}
                onEditItem={onEditItem}
                onItemInfo={onItemInfo}
                onViewItem={onViewDiff}
              />
            ))}
            {!diffs.length && 'There are no diffs in this project.'}
          </div>
        )}
      </Loading>
    );
  }
}
