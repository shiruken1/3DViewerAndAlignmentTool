/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

/* App */
import WithNav from 'graphql/withNav';

import css from './SortableList.module.scss';

export default class extends React.Component {
  static defaultProps = {
    className: null,
    options: [
      {
        text: 'Name',
        sortFunc: (a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA === nameB) return 0;
          return nameA < nameB ? -1 : 1;
        },
      },
      {
        text: 'Status',
        sortFunc: (a, b) => (a.status < b.status ? -1 : 1),
      },
      {
        text: 'Date',
        sortFunc: (a, b) => (a.createdOn < b.createdOn ? -1 : 1),
      },
    ],
    items: null,
    uploadType: null,
  };

  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    itemsProp: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired,
    options: PropTypes.array,
    uploadType: PropTypes.string,
    perms: PropTypes.shape({
      contentCreator: PropTypes.bool.isRequired,
      projectCreator: PropTypes.bool, // for account permissions only
    }).isRequired,
  };

  constructor(props) {
    super(props);
    const isProjectsList = props.itemsProp === 'projects';

    this.state = {
      sortDirection: isProjectsList ? 'down' : 'up',
      sortFunc: props.options.find(
        o => (o.text === isProjectsList ? 'Date' : 'Name'),
      ).sortFunc,
    };
  }

  handleSortDirection = () => {
    /* eslint-disable no-confusing-arrow */
    this.setState(
      prevState =>
        prevState.sortDirection === 'up'
          ? { sortDirection: 'down' }
          : { sortDirection: 'up' },
    );
  };
  /* eslint-enable */

  handleClick = sortFunc => {
    this.setState({ sortFunc });
  };

  renderDropDown(options) {
    const sortByCSS =
      this.props.itemsProp === 'projects' ? css.sortProject : css.sortby;
    return (
      <Dropdown icon="sort" className={sortByCSS}>
        <Dropdown.Menu>
          <Dropdown.Item
            value="SortDirection"
            onClick={this.handleSortDirection}>
            Sort By
            <i className={`sort amount ${this.state.sortDirection} icon`} />
          </Dropdown.Item>
          {options.map(o => (
            <Dropdown.Item
              key={o.text}
              value={o.text}
              onClick={() => this.handleClick(o.sortFunc)}>
              {o.text}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    const {
      className,
      component: Component,
      items,
      itemsProp,
      options,
      title,
      uploadType,
      perms,
      ...rest
    } = this.props;
    // make a copy of the items list, sorted using the selected sort function
    const { sortFunc } = this.state;
    const sortedItems = items.slice().sort(sortFunc);
    // optionally reverse the sorted copy
    if (this.state.sortDirection === 'down') {
      sortedItems.reverse();
    }
    // pass the sorted items list using the requested prop name
    // and pass through other props
    rest[itemsProp] = sortedItems;
    return (
      <div className={[css.lists, className].join(' ')}>
        <div>
          <header className={css.header}>{title}</header>
          {uploadType &&
            perms.contentCreator && (
              <WithNav>
                {({ writeNav }) => (
                  /* eslint-disable */
                  <i
                    role="button"
                    style={{ cursor: 'pointer' }}
                    className="cloud upload icon"
                    onClick={() => {
                      writeNav({ modal: uploadType });
                    }}
                  />
                  /* eslint-enable */
                )}
              </WithNav>
            )}
          {this.renderDropDown(options)}
        </div>
        <Component className={css.list} {...rest} perms={perms} />
      </div>
    );
  }
}
