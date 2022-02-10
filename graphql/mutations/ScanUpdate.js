import { gql } from 'graphql.macro';

export default gql`
  mutation scanUpdate($input: ScanUpdateInput!) {
    scanUpdate(input: $input) {
      scan {
        id
        name
        description
        accountId
        projectId
        units
        status
        files {
          extractedPlanes
          pointsWithFeatures
        }
        uploadPresignedPost {
          url
          fields {
            key
            value
          }
        }
      }
    }
  }
`;
