/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Header, Icon, Message, Modal } from 'semantic-ui-react';

import css from './AddDiffs.module.scss';
/* App */

export default class AddDiffs extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    account: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      diffsRemaining: props.account.diffsRemaining || '',
    };
  }

  handleChange = (e, { name, value }) => {
    const updatedValue =
      parseInt(this.props.account.diffsRemaining, 10) + parseInt(value, 10);
    this.setState({ [name]: updatedValue });
  };

  render() {
    const { error, onCancel, onSave } = this.props;
    const isError = error.length > 0;
    const diffInfoLabel = `Current # of diffs is ${
      this.props.account.diffsRemaining
    }. Please use the field below to add or subtract diffs.`;
    const label = 'Change Available diffs by:';

    return (
      <Modal open>
        <Header content="Alter # Diffs" />
        <Modal.Content>
          <div className={css.diffInfoLabel}>
            <p> {diffInfoLabel} </p>
          </div>
          <div>
            <Form error={isError}>
              <Form.Input
                className={css.InfoBox}
                inline
                label={label}
                placeholder={this.props.account.diffsRemaining}
                name="diffsRemaining"
                defaultValue="0"
                type="number"
                onChange={this.handleChange}
              />
              <Message
                error
                header="Alter diffs failed"
                content={
                  <ul>
                    {error.map(e => (
                      <li key={e.field}>{e.message}</li>
                    ))}
                  </ul>
                }
              />
            </Form>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={() => onSave(this.state)}>
            <Icon name="checkmark" /> Save
          </Button>
          <Button onClick={onCancel}>
            <Icon name="cancel" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
