import { gql } from 'graphql.macro';

import DiffInfo from '../fragments/DiffInfo';

export default gql`
  mutation diffPurchase($input: DiffPurchaseInput!) {
    diffPurchase(input: $input) {
      diff {
        ...DiffInfo
      }
    }
  }
  ${DiffInfo}
`;
