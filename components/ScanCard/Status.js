/* NPM */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Progress } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import css from './ScanCard.module.scss';

const Uploading = styled.div`
  display: flex;
  flex-direction: column;
  & div.progress div.bar {
    min-width: 0;
  }
`;

export default class extends React.PureComponent {
  static propTypes = {
    diff: PropTypes.shape({
      aligned: PropTypes.bool.isRequired,
      modelId: PropTypes.string,
      purchased: PropTypes.bool.isRequired,
      status: PropTypes.string.isRequired,
    }),
    scan: PropTypes.shape({
      status: PropTypes.string.isRequired,
      uploadProgress: PropTypes.number,
    }).isRequired,
  };

  static defaultProps = {
    diff: null,
  };

  render() {
    const { diff, scan } = this.props;
    switch (scan.status) {
      case 'Uploaded':
      case 'Normalizing':
      case 'Preprocessing':
        return <span className={css.info}>Analyzing</span>;
      case 'Done':
        // once preprocessed, status is determined by diff
        break;
      case 'Created':
      case 'Uploading': {
        const yesterday = moment().subtract(1, 'days');
        if (!moment(scan.createdOn).isBefore(yesterday)) {
          return (
            <Uploading>
              <span className={css.info}>Uploading</span>
              <Progress
                percent={100 * (scan.uploadProgress || 0)}
                size="tiny"
              />
            </Uploading>
          );
        }
        if (moment(scan.createdOn).isBefore(yesterday)) {
          return <span className={css.error}>Failed Uploading</span>;
        }
      }
      // eslint-disable-next-line no-fallthrough
      default:
        return <span className={css.error}>Failed</span>;
    }

    if (diff) {
      if (!diff.deleted) {
        if (!diff.modelId) {
          return <span className={css.error}>Needs Association</span>;
        }
        if (!diff.aligned) {
          if (diff.alignment && diff.alignment.method === 'Assisted') {
            if (scan.stats.numPlanes < 3) {
              return <span className={css.error}>Not Enough Planes</span>;
            }

            return <span className={css.info}>Ready to Align</span>;
          }

          return <span className={css.error}>Needs Alignment</span>;
        }

        if (diff.purchased) {
          return <span className={css.info}>Complete</span>;
        }
        switch (diff.status) {
          case 'Failed':
            if (diff.alignment.method === 'DirectEntry') {
              return <span className={css.error}>Bad Transform</span>;
            }

            if (diff.alignment.method === 'Prealigned') {
              return <span className={css.error}>Not Prealigned</span>;
            }

            return <span className={css.error}>Alignment Failed</span>;

          case 'Done':
            return <span className={css.info}>Ready to Diff</span>;
          default:
            return <span className={css.info}>Analyzing</span>;
        }
      } else {
        return <span className={css.info}>Ready to Diff</span>;
      }
    } else {
      return <span className={css.error}>Needs Association</span>;
    }
  }
}
