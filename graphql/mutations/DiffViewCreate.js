import { gql } from 'graphql.macro';

import DiffViewInfo from '../fragments/DiffViewInfo';

export default gql`
  mutation diffViewCreate($input: DiffViewCreateInput!) {
    diffViewCreate(input: $input) {
      diffView {
        ...DiffViewInfo
      }
    }
  }
  ${DiffViewInfo}
`;
