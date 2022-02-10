/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Dropdown } from 'semantic-ui-react';

const SettingsMenu = ({ items }) => (
  <Dropdown
    basic
    icon={null}
    trigger={<Icon bordered={false} name="setting" />}>
    <Dropdown.Menu direction="left">
      {items.map(i => (
        <Dropdown.Item content={i.content} key={i.key} onClick={i.onClick} />
      ))}
    </Dropdown.Menu>
  </Dropdown>
);
SettingsMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default SettingsMenu;
