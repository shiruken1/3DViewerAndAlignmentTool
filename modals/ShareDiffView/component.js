/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';
import { Form, Message } from 'semantic-ui-react';

/* App */
import Modal from 'modals/Modal';
import Link from '../../components/Link';

const LinkContent = styled.div`
  padding-left: 1em;
  padding-top: 1em;
`;

const PermissionText = styled.div`
  padding-left: 1em;
`;

export default class ShareDiffView extends React.PureComponent {
  static propTypes = {
    diffSettings: PropTypes.object.isRequired,
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: [],
  };

  static LinkFields = [
    'activeAccountId',
    'activeProjectId',
    'activeDiffId',
    'activeDiffViewId',
    'view',
  ];
  render() {
    const {
      diffSettings: { limits },
      diffSettings,
      error,
      onCancel,
    } = this.props;
    const tolerances = `R=${parseFloat(limits.crop).toFixed(3)}, Y=${parseFloat(
      limits.red,
    ).toFixed(3)}, G=${parseFloat(limits.yellow).toFixed(3)}`;
    // eslint-disable-next-line no-console
    console.log(diffSettings);
    return (
      <Modal onClose={onCancel} title="Share Diff View">
        <Form>
          <LinkContent>
            Click on icon to copy link to clipboard.
            <Link fields={ShareDiffView.LinkFields} />
          </LinkContent>
          <PermissionText>
            User will need read permissions to view.
          </PermissionText>
          <Message
            header="Details"
            content={
              <ul>
                <li>
                  <span>Tolerances: </span>
                  <span>{tolerances}</span>
                </li>
              </ul>
            }
          />
          <Message
            error
            header="Diff View share failed"
            content={
              <ul>
                {error.map(e => (
                  <li key={e.field}>{e.message}</li>
                ))}
              </ul>
            }
          />
        </Form>
      </Modal>
    );
  }
}
