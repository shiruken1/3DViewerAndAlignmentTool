/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';
import { CopyToClipboard } from 'react-copy-to-clipboard';

/* App */

const Id = styled.button`
  color: lightgrey;
  cursor: pointer;
  font-size: 10px;
  margin-right: 10px;
  white-space: nowrap;
  width: 180px;

  &:hover {
    color: black;
  }

  &:last-of-type {
    margin-bottom: 5px;
    margin-right: 0;
  }
`;

export default class ObjId extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
  };
  static defaultProps = {
    id: null,
    label: null,
  };
  render() {
    const { id, label } = this.props;
    if (!id) {
      return null;
    }
    const content = label ? `${label}: ${id}` : id;
    return (
      <CopyToClipboard text={id}>
        <Id onClick={e => e.stopPropagation()}>{content}</Id>
      </CopyToClipboard>
    );
  }
}
