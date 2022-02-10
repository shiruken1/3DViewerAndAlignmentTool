import { gql } from 'graphql.macro';

import DiffInfo from '../fragments/DiffInfo';

export default gql`
  query diffs($projectId: ID) {
    diffs(projectId: $projectId) {
      ...DiffInfo
    }
  }
  ${DiffInfo}
`;
