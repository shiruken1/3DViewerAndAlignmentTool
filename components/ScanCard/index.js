/* NPM */
import React from 'react';
import { DragSource } from 'react-dnd';

/* App */
import DragTypes from 'lib/DragTypes';
import ScanCard from './component';

import css from './ScanCard.module.scss';

const scanSource = {
  beginDrag(props) {
    const {
      artifact: { id, diffs },
    } = props;
    const diffId = diffs.length && diffs[0].id;
    return { id: diffId || id };
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragTypes.SCAN, scanSource, collect)(
  ({ connectDragSource, isDragging, ...rest }) =>
    connectDragSource(
      // connectDragSource needs a DOM element so wrap with a div
      // translate(0, 0) prevents ugly corners on drag image
      /* eslint-disable prefer-template */
      <div className={css.drag + (isDragging ? ' ' + css.dragging : '')}>
        <ScanCard isDragging={isDragging} {...rest} />
      </div>,
    ),
);
