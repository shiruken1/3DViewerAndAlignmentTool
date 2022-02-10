import { gql } from 'graphql.macro';

export default gql`
  mutation modelCreate($input: ModelCreateInput!) {
    modelCreate(input: $input) {
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
