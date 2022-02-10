/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';
import { css } from 'emotion';

/* App */
import format from 'lib/format';

import Button from 'components/Button';

import Header from '../Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const ButtonRow = styled.div`
  display: flex;
  margin-bottom: 5px;
  & ${Button} {
    flex: 1 0 auto;
    margin: 5px 10px;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
`;

const List = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
`;
const ItemContainer = styled.div`
  display: grid;
  font-size: 14px;
  grid-template-columns: 45px 1fr;
  &:hover {
    background-color: #eaeaea;
  }
`;
const goldText = css({
  color: '#d29b33',
  fontWeight: '500',
});

const ItemHeader = styled.div`
  color: ${props => (props.selected ? '#1d76bc' : '#464646')};
  font-weight: ${props => (props.selected ? '700' : '400')};
`;
const ItemBody = styled.div``;
const ItemLine = styled.div`
  color: #777777;
`;

const Item = ({ item, selected, restoreView }) => {
  const { createdOn, name, limits } = item;
  return (
    <ItemContainer selected={selected} onClick={restoreView}>
      <ItemHeader selected={selected}>{format.dateDDMM(createdOn)}</ItemHeader>
      <ItemHeader className={goldText}>{name}</ItemHeader>
      <div />
      <ItemBody>
        <ItemLine>
          <span>Tolerances: </span>
          <span className={goldText}>
            {`R=${limits.crop}, Y=${limits.red}, G=${limits.yellow}`}
          </span>
        </ItemLine>
      </ItemBody>
    </ItemContainer>
  );
};

Item.propTypes = {
  item: PropTypes.object.isRequired,
  restoreView: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

const Save = props => {
  const {
    activeDiffViewId,
    diff,
    restoreView,
    showAugmentedFiles,
    showSave,
    showShare,
  } = props;
  const items = diff.diffViews
    .slice()
    .sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1));
  return (
    <Container>
      <Header>Save & Share Current View</Header>
      <ButtonRow>
        <Button
          hollow
          onClick={() => {
            showSave();
          }}>
          Save View
        </Button>
        <Button
          disabled={!activeDiffViewId}
          hollow
          onClick={() => {
            showShare();
          }}>
          Share View
        </Button>
        <Button
          disabled={!activeDiffViewId}
          hollow
          onClick={() => {
            showAugmentedFiles();
          }}>
          Download
        </Button>
      </ButtonRow>
      <Header>Saved Views</Header>
      <List>
        {items.map(v => (
          <Item
            item={v}
            key={v.id}
            selected={v.id === activeDiffViewId}
            restoreView={() => restoreView(v)}
          />
        ))}
      </List>
    </Container>
  );
};

Save.propTypes = {
  activeDiffViewId: PropTypes.string,
  diff: PropTypes.object.isRequired,
  restoreView: PropTypes.func.isRequired,
  showAugmentedFiles: PropTypes.func.isRequired,
  showSave: PropTypes.func.isRequired,
  showShare: PropTypes.func.isRequired,
};

Save.defaultProps = {
  activeDiffViewId: null,
};

export default Save;
