/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

/* App */

import css from './InfoTable.module.scss';

export default class extends React.PureComponent {
  static propTypes = {
    labelStyle: PropTypes.object,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.node.isRequired,
        value: PropTypes.node.isRequired,
      }),
    ).isRequired,
  };
  static defaultProps = {
    labelStyle: null,
  };

  render() {
    const { labelStyle, rows } = this.props;
    return (
      <Table basic className={css.table} compact size="small" unstackable>
        <Table.Body>
          {rows.map((r, i) => (
            <Table.Row key={String(i)}>
              <Table.Cell
                className={css.label}
                style={labelStyle}
                textAlign="right">
                {r.label}
              </Table.Cell>
              <Table.Cell className={css.cell}>{r.value}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}
