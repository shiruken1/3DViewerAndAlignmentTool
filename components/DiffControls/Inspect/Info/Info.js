/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

/* App */
import InfoTable from 'components/InfoTable';
import unitDefs from 'util/units';
import THREE from '../../../../gl/three';
import Header from '../../Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const VarContainer = styled.div`
  overflow: auto;
  height: 100px;
`;

const Info = ({ object, units, userUnits, otherVariances }) => {
  const { precision } = unitDefs[userUnits || units];
  const scale = unitDefs[units].to[userUnits || units];
  const { centroid, dm, id, pointsInObj, seenPoints, modelSister } = object;
  const percentScanned = `${((100 * seenPoints) / pointsInObj).toFixed(2)}%`;
  const location = `${(scale * centroid[0]).toFixed(5)}, ${(
    scale * centroid[1]
  ).toFixed(5)}, ${(scale * centroid[2]).toFixed(5)}`;
  const maxVar = `${(scale * dm).toFixed(precision)} ${userUnits || units}`;
  const variance = new THREE.Vector3(...centroid).sub(
    new THREE.Vector3(...modelSister),
  );
  const verticalrow = (scale * variance.z).toFixed(precision);
  const vertical =
    verticalrow > 0 ? `${verticalrow} (Up)` : `${Math.abs(verticalrow)} (Down)`;
  const horizontalrow = new THREE.Vector2().copy(variance).length();
  const horizontal = (scale * horizontalrow).toFixed(precision);
  const objectRows = [
    { label: 'Name', value: id },
    { label: '% Scanned', value: percentScanned },
    // TODO: objdiff needs to provide object area
    // { label: 'Size of Object', value: area },
  ];
  const maxVarRows = [
    { label: 'xyz', value: location },
    { label: 'Variance', value: maxVar },
    { label: 'Horizontal', value: horizontal },
    { label: 'Vertical', value: vertical },
  ];
  const allRows = [{ label: '#', value: 'Variance' }];
  otherVariances.map(v =>
    allRows.push({
      label: v.index,
      value: scale * v.dm,
    }),
  );
  return (
    <Container>
      <Header>Object</Header>
      <InfoTable rows={objectRows} />
      <Header>Max Variance</Header>
      <InfoTable rows={maxVarRows} />
      <Header>All Variances</Header>
      <VarContainer>
        <InfoTable rows={allRows} />
      </VarContainer>
    </Container>
  );
};

Info.propTypes = {
  object: PropTypes.object.isRequired,
  units: PropTypes.string.isRequired,
  userUnits: PropTypes.string.isRequired,
  otherVariances: PropTypes.array.isRequired,
};

export default Info;
