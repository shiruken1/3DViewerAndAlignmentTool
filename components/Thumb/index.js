/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Item, Label } from 'semantic-ui-react';

import css from './Thumb.module.scss';

const Thumb = ({ name, onClick, thumb }) => {
  if (thumb) {
    return (
      <Item.Image
        className={css.image}
        onClick={onClick}
        size="tiny"
        src={thumb}
      />
    );
  }
  // use letter label in place of thumb image
  return (
    <Label circular className={css.label} onClick={onClick}>
      {name.charAt(0).toUpperCase()}
    </Label>
  );
};
Thumb.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  thumb: PropTypes.string,
};
Thumb.defaultProps = {
  thumb: null,
};

export default Thumb;
