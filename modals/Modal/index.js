/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Modal as SUIModal } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import Button from 'components/Button';

const Header = styled.div`
  color: ${props => props.theme.headerColor};
  font-size: 24px;
  font-weight: normal;
`;

const Content = styled.div`
  background-color: ${props => props.theme.modalContentBackgroundColor};
  flex: 1 0 auto;
  margin: 20px 0;
  width: 100%;
`;

const Bottom = styled.div``;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-top: 26.5px;
`;

export default class Modal extends React.PureComponent {
  static propTypes = {
    closeLabel: PropTypes.string,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    width: PropTypes.string,
  };
  static defaultProps = {
    closeLabel: 'Close',
    width: '545px',
  };

  render() {
    const { closeLabel, children, onClose, title, width } = this.props;
    return (
      <SUIModal open style={{ borderRadius: 0, width }}>
        <Main>
          <Header>{title}</Header>
          <Content>{children}</Content>
          <Bottom>
            <Button hollow onClick={onClose} tertiary>
              {closeLabel}
            </Button>
          </Bottom>
        </Main>
      </SUIModal>
    );
  }
}
