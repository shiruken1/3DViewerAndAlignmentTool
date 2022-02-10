import { gql } from 'graphql.macro';

import DiffInfo from '../fragments/DiffInfo';

export default gql`
  mutation scanCreate($input: ScanCreateInput!) {
    scanCreate(input: $input) {
      scan {
        ...ScanInfo
        uploadPresignedPost {
          url
          fields {
            key
            value
          }
        }
      }
      diff {
        ...DiffInfo
      }
    }
  }
  ${DiffInfo}
`;
