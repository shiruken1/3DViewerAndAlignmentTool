import { gql } from 'graphql.macro';

import DiffInfo from '../fragments/DiffInfo';

export default gql`
  mutation diffCreate($input: DiffCreateInput!) {
    diffCreate(input: $input) {
      diff {
        ...DiffInfo
      }
    }
  }
  ${DiffInfo}
`;
