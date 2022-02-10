import { gql } from 'graphql.macro';

import ActivityInfo from './ActivityInfo';
import DiffViewInfo from './DiffViewInfo';
import ModelInfo from './ModelInfo';
import ScanInfo from './ScanInfo';

export default gql`
  fragment DiffInfo on Diff {
    id
    name
    description
    modelId
    scanId
    status
    aligned
    purchased
    thumb
    createdBy {
      id
      firstName
      lastName
    }
    createdOn
    alignment {
      method
      scanTransform
      scanTranslation
      scanRotation
    }
    files {
      glb
      heatmap
      objdiff
    }
    model {
      ...ModelInfo
    }
    scan {
      ...ScanInfo
    }
    activities {
      ...ActivityInfo
    }
    diffViews {
      ...DiffViewInfo
    }
    augmentedFiles {
      fileType
      units
      limits {
        crop
        red
        yellow
      }
      path
      status
    }
    deleted
  }
  ${ActivityInfo}
  ${DiffViewInfo}
  ${ModelInfo}
  ${ScanInfo}
`;
