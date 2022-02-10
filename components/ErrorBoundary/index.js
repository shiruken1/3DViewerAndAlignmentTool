/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';

import { css } from 'emotion';

/* App */

import Nav from 'util/Nav';

const Forbidden = ({ onReset }) => (
  <div>
    You do not have permission for this operation.
    <button
      className={css`
        color: white;
        background-color: #1d76bc;
        font-size: 16px;
        border-radius: 5px;
        padding: 10px 20px 10px 20px;
        margin: 10px 190px 10px 0px;
      `}
      onClick={onReset}>
      Refresh Page
    </button>
  </div>
);
Forbidden.propTypes = {
  onReset: PropTypes.func.isRequired,
};

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  componentDidCatch(error) {
    this.setState({ error });
  }
  render() {
    const { error } = this.state;
    const greenText = css({
      color: '#00d100',
      fontWeight: '700',
    });
    const yellowText = css({
      color: '#e3c000',
      fontWeight: '700',
    });
    const redText = css({
      color: '#c60000',
      fontWeight: '700',
    });
    const greyText = css({
      color: '#464646',
      fontWeight: '700',
    });
    const errorText = css({
      color: 'white',
      fontSize: '15px',
    });
    const messageArea = css({
      position: 'fixed',
      top: '42%',
      left: '35%',
      width: '30em',
      fontSize: '24px',
      fontWeight: '100',
      color: '#464646',
    });
    const middleLine = css({
      marginTop: '2px',
      marginBottom: '2px',
    });

    if (error) {
      return (
        <ApolloConsumer>
          {client => {
            const onReset = () => {
              client.writeData({
                data: {
                  nav: Nav.defaultValue,
                },
              });
              this.setState({
                error: null,
              });
            };
            if (/GraphQL error: Forbidden/.test(error.message)) {
              return <Forbidden onReset={onReset} />;
            }
            return (
              <div className={messageArea}>
                <h1>Something went wrong.</h1>
                <div>
                  <span className={greenText}>10,000,000,000,000</span> data
                  points in scan? <span className={greyText}>Check.</span>
                </div>
                <div className={middleLine}>
                  <span className={greenText}>10,000</span> objects in model?{' '}
                  <span className={greyText}>Got 'em all.</span>
                </div>
                <span className={yellowText}>1 thing</span> you just clicked on?{' '}
                <span className={redText}>We have no idea.</span>
                <br />
                <button
                  className={css`
                    color: white;
                    background-color: #1d76bc;
                    font-size: 16px;
                    border-radius: 5px;
                    padding: 10px 20px 10px 20px;
                    margin: 10px 190px 10px 0px;
                  `}
                  onClick={onReset}>
                  Refresh Page
                </button>
                <a href="mailto:support@skur.com?Subject=Something%20went%20wrong">
                  <button
                    className={css`
                    color; #464646;
                    background-color: white;
                    font-size: 16px;
                    border: 1px solid #1d76bc;
                    border-radius: 5px;
                    padding: 10px 20px 10px 20px;
                    margin-top; 10px;
                  `}>
                    Send Us An Email
                  </button>
                </a>
                <div className={errorText}>{String(error)}</div>
              </div>
            );
          }}
        </ApolloConsumer>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
