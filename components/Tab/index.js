import React from 'react';
import PropTypes from 'prop-types';

import { Popup } from 'semantic-ui-react';
import TabButton from './TabButton';
import TabContainer from './TabContainer';
import TabContent from './TabContent';
import TabSet from './TabSet';

export default class extends React.PureComponent {
  static propTypes = {
    activeIndex: PropTypes.string.isRequired,
    large: PropTypes.bool,
    onSetActiveIndex: PropTypes.func.isRequired,
    panes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    scrollable: PropTypes.bool,
  };

  static defaultProps = {
    large: false,
    scrollable: false,
  };

  render() {
    const {
      activeIndex,
      large,
      onSetActiveIndex,
      panes,
      scrollable,
    } = this.props;
    return (
      <TabContainer scrollable={scrollable}>
        <TabSet>
          {panes.map(
            p =>
              !p.content ? (
                <TabButton
                  active={p.value === activeIndex}
                  disabled={p.disabled}
                  key={p.value}
                  large={large}
                  onClick={() => onSetActiveIndex(p.value)}>
                  {p.name}
                </TabButton>
              ) : (
                <Popup
                  trigger={
                    <TabButton
                      active={p.value === activeIndex}
                      disabled={p.disabled}
                      large={large}
                      onClick={() => onSetActiveIndex(p.value)}>
                      {p.name}
                    </TabButton>
                  }
                  content={p.content}
                  key={p.value}
                  on="click"
                />
              ),
          )}
        </TabSet>
        <TabContent scrollable={scrollable}>
          {panes.find(p => p.value === activeIndex).render()}
        </TabContent>
      </TabContainer>
    );
  }
}
