import { gql } from 'graphql.macro';

import DiffInfo from '../fragments/DiffInfo';

export default gql`
  query diff($id: ID!) {
    diff(id: $id) {
      ...DiffInfo
    }
  }
  ${DiffInfo}
`;
