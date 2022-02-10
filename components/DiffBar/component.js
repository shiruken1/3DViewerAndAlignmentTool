/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, Message } from 'semantic-ui-react';

/* App */
import css from './DiffBar.module.scss';

function formatDate(string) {
  const date = new Date(string);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

const DisabledBox = () => {
  const className = css.disabledBar;
  return (
    <div className={className}>
      <div className={css.inner}>
        <div className={css.top}>
          <span className={css.title}>Create New Diff</span>
          <Icon className={css.icon} name="arrows alternate" />
          <span className={css.drag}>Drag a Point Cloud Card Here</span>
        </div>
      </div>
    </div>
  );
};

const ClosedBox = ({ isOver }) => {
  const className = isOver ? css.hoverBar : css.bar;
  return (
    <div className={className}>
      <div className={css.inner}>
        <div className={css.top}>
          <span className={css.title}>Create New Diff</span>
          <Icon className={css.icon} name="arrows alternate" />
          <span className={css.drag}>Drag a Point Cloud Card Here</span>
        </div>
      </div>
    </div>
  );
};
ClosedBox.propTypes = {
  isOver: PropTypes.bool.isRequired,
};

const FailedBox = ({ isOver, message, onClose }) => {
  const className = isOver ? css.hoverFailedBar : css.failedBar;
  return (
    <div className={className}>
      <div className={css.inner}>
        <div className={css.top}>
          <span className={css.left}>{message}</span>
          <Icon name="times circle" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};
FailedBox.propTypes = {
  isOver: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

class OpenBox extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    isOver: PropTypes.bool.isRequired,
    scan: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onPurchase: PropTypes.func.isRequired,
  };
  static defaultProps = {
    error: [],
  };
  state = {
    name: '',
    description: '',
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  render() {
    const { error, isOver, scan, model, onClose, onPurchase } = this.props;
    const { name, description } = this.state;
    const className = isOver ? css.hoverBar : css.bar;
    const isError = error.length > 0;
    return (
      <div className={className}>
        <div className={css.inner}>
          <div className={css.top}>
            <span className={css.title}>Create New Diff</span>
            <Icon name="times circle" onClick={onClose} />
          </div>
          <div className={css.bottom}>
            <div className={css.artifact}>
              <div className={css.name}>{scan.name}</div>
              <div className={css.date}>
                <span className={css.label}>Date Added: </span>
                <span>{formatDate(scan.createdOn)}</span>
              </div>
            </div>
            <div className={css.artifact}>
              <div className={css.name}>{model.name}</div>
              <div className={css.date}>
                <span className={css.label}>Date Added: </span>
                <span>{formatDate(model.createdOn)}</span>
              </div>
            </div>
            <div className={css.form}>
              <div className={css.inputs}>
                <Input
                  className={css.input}
                  name="name"
                  placeholder="Diff Name*"
                  onChange={this.handleChange}
                  value={name}
                />
                <Input
                  className={css.input}
                  name="description"
                  placeholder="Description"
                  onChange={this.handleChange}
                  value={description}
                />
              </div>
              <Button
                className={css.button}
                disabled={!name.trim().length}
                onClick={() => {
                  onPurchase(this.state);
                }}>
                Process Diff Now
              </Button>
            </div>
          </div>
          <Message
            error
            header="Diff purchase failed"
            content={
              <ul>
                {error.map(e => (
                  <li key={e.field}>
                    {e.field === '_' ? e.message : `${e.field}: ${e.message}`}
                  </li>
                ))}
              </ul>
            }
            hidden={!isError}
          />
        </div>
      </div>
    );
  }
}

export default class extends React.PureComponent {
  static propTypes = {
    canDiff: PropTypes.bool.isRequired,
    diffInCart: PropTypes.object,
    error: PropTypes.array,
    onAddToCart: PropTypes.func.isRequired,
    onPurchaseDiff: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    diffs: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  };
  static defaultProps = {
    diffInCart: null,
    error: [],
  };

  onClose = () => {
    this.props.onAddToCart(null);
  };

  onPurchase = state => {
    this.props.onPurchaseDiff({
      id: this.props.diffInCart.diff.id,
      updates: state,
    });
  };
  render() {
    const { canDiff, diffs, diffInCart, isOver, error } = this.props;

    if (!canDiff && diffs.length === 0) {
      return <DisabledBox />;
    }

    if (!diffInCart) {
      return <ClosedBox isOver={isOver} />;
    }
    const { diff, model, scan } = diffInCart;
    if (!diff || diff.status !== 'Done') {
      return (
        <FailedBox
          isOver={isOver}
          message={`Scan "${
            scan.name
          }" must be aligned with a model before diffing`}
          onClose={this.onClose}
        />
      );
    }
    if (diff.purchased && !diff.deleted) {
      return (
        <FailedBox
          isOver={isOver}
          message={`Scan "${scan.name}" has already been diffed`}
          onClose={this.onClose}
        />
      );
    }
    return (
      <OpenBox
        error={error}
        isOver={isOver}
        scan={scan}
        model={model}
        onClose={this.onClose}
        onPurchase={this.onPurchase}
      />
    );
  }
}
