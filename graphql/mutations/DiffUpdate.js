import { gql } from 'graphql.macro';

import DiffInfo from '../fragments/DiffInfo';

export default gql`
  mutation diffUpdate($input: DiffUpdateInput!) {
    diffUpdate(input: $input) {
      diff {
        ...DiffInfo
      }
    }
  }
  ${DiffInfo}
`;
