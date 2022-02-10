import { gql } from 'graphql.macro';

import DiffViewInfo from '../fragments/DiffViewInfo';

export default gql`
  mutation diffViewDelete($input: DiffViewDeleteInput!) {
    diffViewDelete(input: $input) {
      diffView {
        id
        deleted
      }
    }
  }
  ${DiffViewInfo}
`;
