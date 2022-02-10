/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Message } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import Modal from 'modals/Modal';

const Content = styled.div`
  align-items: center;
  display: flex;
  padding: 20.5px;
`;

const BuyButton = styled(Button)`
  margin: 15px 15px !important;
  width: 100px;
  float: right;
`;

export default class BuyDiffs extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onBuy: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      diffsRequested: '1',
    };
  }

  static defaultProps = {
    error: [],
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  render() {
    const { error, onCancel, onBuy } = this.props;
    const { diffsRequested } = this.state;
    const isError = error.length > 0;

    return (
      <Modal
        title="Purchase Diffs"
        onClose={onCancel}
        closeLabel="Cancel"
        width="300px">
        <Content>
          <Form error={isError}>
            <Form.Input
              label="Diffs"
              name="diffsRequested"
              value={diffsRequested}
              type="number"
              onChange={this.handleChange}
            />
            <Message
              error
              header="Diff purchase failed"
              content={
                <ul>
                  {error.map(e => (
                    <li key={e.field}>{e.message}</li>
                  ))}
                </ul>
              }
            />
          </Form>
        </Content>
        <BuyButton color="orange" onClick={() => onBuy(this.state)}>
          Buy Now
        </BuyButton>
      </Modal>
    );
  }
}
