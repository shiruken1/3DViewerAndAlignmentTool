import { gql } from 'graphql.macro';

import DiffInfo from '../fragments/DiffInfo';

export default gql`
  mutation diffRequestAugment($input: DiffRequestAugmentInput!) {
    diffRequestAugment(input: $input) {
      diff {
        ...DiffInfo
      }
    }
  }
  ${DiffInfo}
`;
