/* NPM */
import React from 'react';
import { DropTarget } from 'react-dnd';

/* App */
import DragTypes from 'lib/DragTypes';

import DiffBar from './component';

const bbbTarget = {
  drop(props, monitor) {
    props.onAddToCart(monitor.getItem().id);
    return monitor.getItem();
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

const BBB = ({
  canDiff,
  className,
  connectDropTarget,
  diffInCart,
  isOver,
  onAddToCart,
  onPurchaseDiff,
  purchaseErrors,
  diffs,
}) =>
  connectDropTarget(
    <div className={className}>
      <DiffBar
        canDiff={canDiff}
        diffInCart={diffInCart}
        error={purchaseErrors}
        isOver={isOver}
        onAddToCart={onAddToCart}
        onPurchaseDiff={onPurchaseDiff}
        diffs={diffs}
      />
    </div>,
  );

export default DropTarget(DragTypes.SCAN, bbbTarget, collect)(BBB);
