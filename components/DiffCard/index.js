/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import ActivityList from 'components/ActivityList';
import CollapsingCard from 'components/CollapsingCard';
import SettingsMenu from 'components/SettingsMenu';
import Thumb from 'components/Thumb';

import Info from './Info';

import css from './DiffCard.module.scss';

export default class extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    activities: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    associated: PropTypes.bool.isRequired,
    diff: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      createdBy: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }).isRequired,
      createdOn: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      thumb: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    onClickThumb: PropTypes.func.isRequired,
    // onDeleteItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    onViewItem: PropTypes.func.isRequired,
    onItemInfo: PropTypes.func.isRequired,
    perms: PropTypes.object.isRequired,
  };
  render() {
    const {
      active,
      activities,
      associated,
      diff,
      onClick,
      onClickThumb,
      // onDeleteItem,
      onEditItem,
      onViewItem,
      onItemInfo,
      perms,
    } = this.props;

    const menu = [
      { content: 'View More Info', key: 3, onClick: () => onItemInfo(diff.id) },
    ];
    if (perms.contentCreator) {
      menu.push(
        { content: 'Edit', key: 1, onClick: () => onEditItem(diff.id) },
        // {
        //   content: 'Delete',
        //   key: 2,
        //   onClick: () => onDeleteItem(diff.id),
        // },
      );
    }

    return (
      <CollapsingCard
        active={active}
        associated={associated}
        content={
          <div className={css.bottom}>
            <div className={css.thumb}>
              <Thumb
                name={diff.name}
                onClick={onClickThumb}
                thumb={diff.thumb}
              />
            </div>
            <div className={css.right}>
              <Info diff={diff} />
            </div>
          </div>
        }
        extra={
          <ActivityList
            activities={activities}
            displayProject={false}
            stacked
          />
        }
        menu={<SettingsMenu items={menu} />}
        name={diff.name}
        onClick={onClick}
        onView={() => onViewItem(diff.id)}
        perms={perms}
      />
    );
  }
}
