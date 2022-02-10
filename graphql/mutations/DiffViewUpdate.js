import { gql } from 'graphql.macro';

import DiffViewInfo from '../fragments/DiffViewInfo';

export default gql`
  mutation diffViewUpdate($input: DiffViewUpdateInput!) {
    diffViewUpdate(input: $input) {
      diffView {
        ...DiffViewInfo
      }
    }
  }
  ${DiffViewInfo}
`;
