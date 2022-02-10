/* NPM */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Progress } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import css from './ModelCard.module.scss';

const Uploading = styled.div`
  display: flex;
  flex-direction: column;
  & div.progress div.bar {
    min-width: 0;
  }
`;

export default class extends React.PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      status: PropTypes.string.isRequired,
      uploadProgress: PropTypes.number,
    }).isRequired,
  };

  render() {
    const { model } = this.props;
    switch (model.status) {
      case 'Uploaded':
      case 'Normalizing':
      case 'Preprocessing':
        return <span className={css.info}>Preprocessing</span>;
      case 'Done':
        return <span className={css.info}>Complete</span>;
      case 'Created':
      case 'Uploading': {
        const yesterday = moment().subtract(1, 'days');
        if (!moment(model.createdOn).isBefore(yesterday)) {
          return (
            <Uploading>
              <span className={css.info}>Uploading</span>
              <Progress
                percent={100 * (model.uploadProgress || 0)}
                size="tiny"
              />
            </Uploading>
          );
        }
      }
      // eslint-disable-next-line no-fallthrough
      default:
        return <span className={css.error}>Failed</span>;
    }
  }
}
