/* NPM */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion/macro';

/* App */
import Button from 'components/Button';

const ListGrid = styled.div`
  color: ${props => props.theme.subHeaderColor};
  display: grid;
  grid-template-rows: 30px;
  grid-auto-rows: 24px;
  grid-gap: 2px;
  margin-top: -5px;
`;

const RowGrid = styled.div`
  align-items: end;
  display: grid;
  grid-template-columns: 100px minmax(190px, 1fr) repeat(2, 60px);
  grid-gap: 2px;
  padding-right: 8px;

  background: ${props => props.background};
  color: ${props => props.color};
`;

const HeaderText = styled.div`
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.1px;
  line-height: 1;
`;

const Item = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-top: -1px;
  text-align: ${props => (props.right ? 'right' : 'left')};
  &:first-child {
    margin-left: 1px;
  }
`;

export default class Table extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        accountId: PropTypes.string,
        projectId: PropTypes.string,
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
    onRespond: PropTypes.func.isRequired,
  };

  render() {
    const { items, onRespond } = this.props;
    return (
      <ListGrid>
        <RowGrid>
          <HeaderText>Inviter</HeaderText>
          <HeaderText>Scope</HeaderText>
        </RowGrid>
        {items.map(i => (
          <RowGrid key={i.accountId + i.projectId}>
            <Item>{i.name}</Item>
            <Button
              hollow
              onClick={() =>
                onRespond({
                  accountId: i.accountId,
                  projectId: i.projectId,
                  accept: true,
                })
              }>
              Accept
            </Button>
            <Button
              hollow
              onClick={() =>
                onRespond({
                  accountId: i.accountId,
                  projectId: i.projectId,
                  accept: false,
                })
              }>
              Reject
            </Button>
          </RowGrid>
        ))}
      </ListGrid>
    );
  }
}
