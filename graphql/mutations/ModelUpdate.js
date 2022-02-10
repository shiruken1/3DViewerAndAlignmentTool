import { gql } from 'graphql.macro';

export default gql`
  mutation modelUpdate($input: ModelUpdateInput!) {
    modelUpdate(input: $input) {
      model {
        id
        name
        description
        accountId
        projectId
        units
        status
        files {
          glb
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
