import { gql } from 'graphql.macro';

export default gql`
  mutation scanDelete($input: ScanDeleteInput!) {
    scanDelete(input: $input) {
      scan {
        id
        deleted
      }
    }
  }
`;
